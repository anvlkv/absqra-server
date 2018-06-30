import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from 'koa2-cors';
import { createConnection } from 'typeorm';
import { environment } from '../environments/environment';
import session = require('koa-session-async');
import { createCRUDRouterForEntities } from './simpleCrud';
import { Project, Question, Sequence, Step } from '../entity';
import { RespondentsList } from '../entity/respondentsList';
import { SequenceResponse } from '../entity/response';
import { logger, trimmer, xResponseTime } from '../util/helpers';
import { startWebServer } from './webServer';
import * as bodyParser from 'koa-body';


const port = environment.apiPort;

export const myCorsOptions: cors.Options = {
    credentials: true,
    origin: `${environment.protocol ? environment.protocol + '://' : ''}${environment.host}:${environment.clientPort || environment.port}`
};

console.time('App listening on port ' + port);
console.time('Connected to PostgresSQL instance');

(async () => {
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
    const app = new Koa();


    // TODO: learn to do it as part of build.
    const crudRouter = createCRUDRouterForEntities({
        Project,
        Sequence,
        Step,
        Question,
        SequenceResponse,
        RespondentsList
    }, 'crud', true);
    // /TODO

    app.keys = environment.secret;

    app.use(session(CONFIG, app));
    app.use(trimmer());


    app.use(async (ctx, next) => {
        await next();

        if (ctx.status == 204 && ctx.method == 'GET') {
            ctx.throw(404, 'Not found');
        }
    });

    app.use(xResponseTime());

    app.use(logger('app'));

    app.use(helmet());


    app.use(cors(myCorsOptions));


    app.use(bodyParser())
    .use(crudRouter.routes())
    .use(crudRouter.allowedMethods());

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
