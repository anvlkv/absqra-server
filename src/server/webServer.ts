import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as send from 'koa-send';
import { environment } from '../environments/environment';
import { logger, xResponseTime } from '../util/helpers';
import { myCorsOptions } from './main';

export function startWebServer() {
    const webServerApp = new Koa();

    console.time(`Web server listening on port ${environment.port}`);

    webServerApp.use(xResponseTime());

    webServerApp.use(logger('web'));

    webServerApp.use(helmet());

    webServerApp.use(async (ctx, next) => {

        await next();

        ctx.cookies.set('API-URL', `${environment.protocol ? environment.protocol + '://' : ''}${environment.host}:${environment.apiPort}`, {sameSite: true, httpOnly: false});
    });

    webServerApp.use(serve('src/client'));

    webServerApp.use(async (ctx, next) => {

        await next();

        if (!ctx.body) {

            await send(ctx, 'src/client/index.html');

        }

    });

    webServerApp.use(cors(myCorsOptions));

    webServerApp.listen(environment.port, () => {

        console.timeEnd(`Web server listening on port ${environment.port}`);

    });
}
