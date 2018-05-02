import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from 'koa2-cors';
import * as convert from 'koa-convert';
import { createConnection } from 'typeorm';
import { fixture } from './fixture';
import { environment } from '../environments/environment';
import session = require('koa-session-async');
import serve = require('koa-static');
import send = require('koa-send');
import { createCRUDRouterForEntities } from './simpleCrud';
import { Project, Question, Sequence, Step } from '../entity';
import { exportRoutes } from './exportRoutes';
import { RespondentsList } from '../entity/respondentsList';
import { SequenceResponse } from '../entity/response';


const port = environment.apiPort;
const portShifted = port + 42;


console.time('App listening on port ' + port);
console.time('MetaApp listening on port ' + portShifted);
console.time(`Web server listening on port ${environment.port}`);
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
    const webServerApp = new Koa();

    app.keys = environment.secret;

    app.use(session(CONFIG, app));

    const crudRouter = createCRUDRouterForEntities({
        Project,
        Sequence,
        Step,
        Question,
        Response: SequenceResponse,
        RespondentsList
    });

    app.use(crudRouter.routes());
    app.use(crudRouter.allowedMethods());
    exportRoutes(crudRouter, 'CRUDRouter');

    app.use(xResponseTime());
    webServerApp.use(xResponseTime());

    app.use(logger('app'));
    webServerApp.use(logger('web'));

    app.use(helmet());
    webServerApp.use(helmet());

    app.use(trimmer());

    webServerApp.use(serve('src/client'));

    webServerApp.use(async (ctx, next) => {
        if (!ctx.body) {
            await send(ctx, 'src/client/index.html');
        }
        next();
    });

    const myCorsOptions = {
        credentials: true,
        origin: adjustAllowedOrigin(environment.port),
    };
    app.use(convert(cors(myCorsOptions)));

    const myCorsOptionsWeb = {
        credentials: true,
        origin: adjustAllowedOrigin(environment.port),
    };
    webServerApp.use(convert(cors(myCorsOptionsWeb)));


    app.listen(port, () => {
        console.timeEnd('App listening on port ' + port);
    });

    webServerApp.listen(environment.port, () => {
        console.timeEnd(`Web server listening on port ${environment.port}`);
    });
})();

function xResponseTime() {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-SequenceResponse-Time', `${ms}ms`);
    };
}


function logger(name) {
    return async (ctx, next) => {
        console.time(`${name} - ${ctx.method} ${ctx.url}`);
        await next();
        console.timeEnd(`${name} - ${ctx.method} ${ctx.url}`);
    };
}

function trimObject(obj) {
    if (!obj) {
        return;
    }

    for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'string') {
            obj[k] = <String>(obj[k]).trim();
        }
        else if (typeof obj[k] === 'object') {
            obj[k] = trimObject(obj[k]);
        }
    }
    return obj;
}

function trimmer() {
    return async (ctx, next) => {
        await next();
        ctx.body = trimObject(ctx.body);
    };
}

function adjustAllowedOrigin(sourcePort) {
    const client = `${environment.protocol ? environment.protocol + '://' : ''}${environment.host}:${sourcePort}`;
    return function (req) {
        // const [originProtocol, originHost, originPort] = req.headers['origin'].split(':');

        // return `${req.protocol}://${req.host.split(':')[0]}:${originPort ? originPort : ''}`;
        return client;
    };
}
