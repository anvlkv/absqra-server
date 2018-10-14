import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as send from 'koa-send';
import * as websockify from 'koa-websocket';
import * as fs from 'fs';
import * as Router from 'koa-router';

import { environment } from '../environments/environment';
import { logger, xResponseTime } from '../util/helpers';
import { myCorsOptions } from './apiServer';
import { exportRoutes } from '../util/exportRoutes';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const clientRoot = 'src/client';

export function startWebServer() {
    const webServerApp = websockify(new Koa());

    console.time(`Web server listening on port ${environment.port}`);

    webServerApp.use(xResponseTime());

    webServerApp.use(logger('web'));

    webServerApp.use(helmet());

    webServerApp.use(async (ctx, next) => {

        await next();

        ctx.cookies.set('API-URL', `${environment.protocol ? environment.protocol + '://' : ''}${environment.host}:${environment.apiPort}`, {sameSite: true, httpOnly: false});
    });

    webServerApp.use(serve(clientRoot, {gzip: true}));

    webServerApp.use(async (ctx, next) => {

        await next();

        if (!ctx.body) {

            await send(ctx, `${clientRoot}/index.html`);

        }

    });

    webServerApp.use(cors(myCorsOptions));

    const wsRouter = new Router();

    const watchers = [];
    const clientChangeSubject = new Subject();

    fs.watch(`${clientRoot}`, {persistent: true, recursive: true}, (eventType, filename) => {
        clientChangeSubject.next(filename);
    });

    wsRouter.all('clientReload', '/util/client-reload',  (ctx) => {
        ctx['websocket'].send('listen');
        watchers.push(ctx['websocket']);
        clientChangeSubject.pipe(
            debounceTime(500)
        ).subscribe(reload => {
            watchers.forEach((watcher, at) => {
                if (watcher.readyState === 1) {
                    watcher.send('reload');
                    console.log(`triggering client reload [${at}]`)
                }
                else {
                    watchers.splice(at, 1);
                }
            });
        })
    });

    webServerApp.ws.use(function(ctx, next) {
        // return `next` to pass the context (ctx) on to the next ws middleware
        return next();
    });

    webServerApp.ws
    .use(wsRouter.routes())
    .use(wsRouter.allowedMethods());

    if (!environment.production) {
        exportRoutes(wsRouter, 'wsUtil', `${environment.wsprotocol ? environment.wsprotocol + '://' : ''}${environment.host}:${environment.port}`);
    }

    webServerApp.listen(environment.port, () => {
        console.timeEnd(`Web server listening on port ${environment.port}`);
    });
}
