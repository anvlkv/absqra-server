import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-body';
import * as session from 'koa-session-async';
import * as Router from 'koa-router';
import * as websockify from 'koa-websocket';

import { createConnection } from 'typeorm';
import { environment } from '../environments/environment';
import { CRUDRouterManager } from './crudRouterManager';
import { Project, Question, Sequence, Step, RespondentsList, SequenceResponse} from '../entity';
import { logger, trimmer, xResponseTime } from '../util/helpers';
import { startWebServer } from './webServer';
import { exportRoutes } from '../util/exportRoutes';
import { ViewRouter } from './viewRouter';


const port = environment.apiPort;

export const myCorsOptions: cors.Options = {
    credentials: true,
    origin: `${environment.protocol ? environment.protocol + '://' : ''}${environment.host}:${environment.clientPort || environment.port}`
};

console.time('App listening on port ' + port);
console.time('Connected to PostgresSQL instance');

(async () => {
    let app = new Koa();
    const connection = await createConnection()
    .catch(e => console.log('TypeORM connection error: ', e));

    console.timeEnd('Connected to PostgresSQL instance');


    const CONFIG = {
        key: 'intervey:session', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        // store: sessionStore,
        maxAge: 86400000,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response.
         The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
    };

    app = websockify(app);

    app.keys = environment.secret;

    app.use(session(CONFIG, app));
    app.use(trimmer());
    app.use(cors(myCorsOptions));


    app.use(async (ctx, next) => {
        await next();

        if (ctx.status == 204 && ctx.method == 'GET') {
            ctx.throw(404, 'Not found');
            if (!environment.production) {
                console.error(`404: Not found [${ctx.req.url}]`)
            }
        }
    });

    app.use(xResponseTime());

    app.use(logger('app'));

    app.use(helmet());


    const crudRouterManager = new CRUDRouterManager({
        Project,
        Sequence,
        Question,
        SequenceResponse,
        RespondentsList
    }, 'crud');



    const crudRouter = crudRouterManager.router;

    if (!environment.production) {
        exportRoutes(crudRouterManager.router, 'CRUDRouter');
    }

    app.use(bodyParser())
        .use(crudRouter.routes())
        .use(crudRouter.allowedMethods());

    const viewRouterManager = new ViewRouter();
    const viewRouter = viewRouterManager.router;

    app.use(viewRouter.routes())
        .use(viewRouter.allowedMethods());


    const deadEnd = new Router();

    deadEnd.register('**', ['GET', 'POST', 'PATCH', 'DELETE'], async (ctx, next) => {
        await next();
        if (!ctx.body) {
            ctx.throw(404);
        }
    });

    app.use(deadEnd.routes())
        .use(deadEnd.allowedMethods());

    if (!environment.production) {
        exportRoutes(viewRouterManager.router, 'ViewRouter');
    }
    app.listen(port, () => {
        console.timeEnd('App listening on port ' + port);

        if (environment.port) {
            startWebServer();
        }
        else {
            console.warn(`Use client at ${environment.clientPort} or specify environment.port`);
        }
    });
})();

process.on('SIGINT', () => { console.log('doei doei!'); process.exit(); });
