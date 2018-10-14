import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-body';
import * as session from 'koa-session-async';
import * as Router from 'koa-router';
import * as websockify from 'koa-websocket';

import { createConnection } from 'typeorm';
import { environment } from '../environments/environment';
import { CRUDRouterManager } from '../api/crudRouterManager';
import { Project, Question, Sequence, RespondentsList, SequenceResponse} from '../entity';
import { logger, xResponseTime } from '../util/helpers';
import { exportRoutes } from '../util/exportRoutes';
import { RespondentRouter } from '../api/respondentRouter';
import { DataOpRouterManager } from '../api/dataOpRouterManager';


const port = environment.apiPort;

export const myCorsOptions: cors.Options = {
    credentials: true,
    origin: `${environment.protocol ? environment.protocol + '://' : ''}${environment.host}:${environment.clientPort || environment.port}`
};

console.time('App listening on port ' + port);
console.time('Connected to PostgresSQL instance');

export async function startApiServer() {
    let app = new Koa();
    const connection = await createConnection();

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

    app.use(bodyParser());

    const crudRouterManager = new CRUDRouterManager({
        Project,
        Sequence,
        Question,
        SequenceResponse,
        RespondentsList
    }, ['GET', 'POST', 'PATCH', 'DELETE'], ['GET', 'POST'], 'crud');
    const crudRouter = crudRouterManager.router;
    if (!environment.production) {
        exportRoutes(crudRouterManager.router, 'CRUDRouter');
    }
    app.use(crudRouter.routes())
        .use(crudRouter.allowedMethods());

    const viewRouter = new RespondentRouter();
    app.use(viewRouter.routes())
        .use(viewRouter.allowedMethods());

    const dataOpRouterManager = new DataOpRouterManager({
        Project,
        Sequence,
        Question,
        SequenceResponse,
        RespondentsList
    }, ['POST'], ['POST'], 'data-op');
    const dataOpRouter = dataOpRouterManager.router;

    if (!environment.production) {
        exportRoutes(dataOpRouterManager.router, 'DataOpRouter');
    }

    app.use(dataOpRouter.routes())
        .use(dataOpRouter.allowedMethods());



    // keep at the end of stack...
    const deadEnd = new Router();
    deadEnd.register('**', ['GET', 'POST', 'PATCH', 'DELETE'], async (ctx, next) => {
        await next();
        if (!ctx.body) {
            ctx.throw(404);
            if (!environment.production) {
                console.error(`404: Not found [${ctx.req.url}]`)
            }
        }
    });
    app.use(deadEnd.routes())
        .use(deadEnd.allowedMethods());

    if (!environment.production) {
        exportRoutes(viewRouter, 'RespondentRouter');
    }
    app.listen(port, () => {
        console.timeEnd('App listening on port ' + port);
    });
}

process.on('SIGINT', () => { console.log('doei doei!'); process.exit(); });
