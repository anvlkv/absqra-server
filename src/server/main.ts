import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import { createConnection } from 'typeorm';

import { interviewerRouter } from './actions/InterviewerActions';
import { identitiesRouter } from './actions/IdentityActions';
import { respondentRouter } from './actions/RespondentActions';
import { metaRouter } from './actions/MetaActions';
import { fixture } from './fixture';
import { environment } from '../environments/environment';
import session = require('koa-session-async');
import serve = require('koa-static');
import send = require('koa-send');


const port = process.argv[2] ? Number(process.argv[2]) : 3000;
const portShifted = port + 42;


console.time('App listening on port ' + port);
console.time('MetaApp listening on port ' + portShifted);
console.time(`Web server listening on port ${environment.webPort}`);
console.time('Connected to PostgresSQL instance');

(async () => {
    const connection = await createConnection().catch(e => console.log('TypeORM connection error: ', e));

    console.timeEnd('Connected to PostgresSQL instance');

    fixture()();
    // const connectionOptions = connection['options'];
    // const sessionStore = new PgStore(`
    // 	postgres://${connectionOptions.username}
    // 	:${connectionOptions.password}
    // 	@${connectionOptions.host}
    // 	:${connectionOptions.port}
    // 	/${connectionOptions.database}
    // `);


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
    const metaApp = new Koa();
    const webServerApp = new Koa();

    app.keys = environment.secret;

    app.use(session(CONFIG, app));

    app.use(xResponseTime());
    metaApp.use(xResponseTime());
    webServerApp.use(xResponseTime());

    app.use(logger('app'));
    metaApp.use(logger('meta'));
    webServerApp.use(logger('web'));

    app.use(helmet());
    metaApp.use(helmet());
    webServerApp.use(helmet());


    const myCorsOptions = {
        credentials: true,
        origin: adjustAllowedOrigin(),
    };

    // TODO: should know your domains here
    app.use(cors(myCorsOptions));
    metaApp.use(cors(myCorsOptions));
    webServerApp.use(cors(myCorsOptions));

    app.use(trimmer());
    metaApp.use(trimmer());


    // routes
    metaApp
    .use(metaRouter.routes())
    .use(metaRouter.allowedMethods());

    app
    .use(identitiesRouter.routes())
    .use(identitiesRouter.allowedMethods());

    app
    .use(interviewerRouter.routes())
    .use(interviewerRouter.allowedMethods());

    app
    .use(respondentRouter.routes())
    .use(respondentRouter.allowedMethods());

    webServerApp.use(serve('src/client'));

    webServerApp.use(async (ctx, next) => {
        if (!ctx.body) {
            await send(ctx, 'src/client/index.html');
        }
        next();
    });

    app.listen(port, () => {
        console.timeEnd('App listening on port ' + port);
    });

    metaApp.listen(portShifted, () => {
        console.timeEnd('MetaApp listening on port ' + portShifted);
    });

    webServerApp.listen(environment.webPort, () => {
        console.timeEnd(`Web server listening on port ${environment.webPort}`);
    });
})();

function xResponseTime() {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
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

function adjustAllowedOrigin(isMeta?: boolean) {
    return function (req) {
        const [originProtocol, originHost, originPort] = req.headers['origin'].split(':');

        return `${req.protocol}://${req.host.split(':')[0]}:${originPort ? originPort : ''}`;
    };
}
