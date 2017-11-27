import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import { createConnection } from 'typeorm';

import { interviewerRouter } from './routes/InterviewerRoutes';
import { identitiesRouter } from './routes/IdentityRoutes';
import { respondentRouter } from './routes/RespondentRoutes';
import { metaRouter } from './routes/MetaRoutes';
import { fixture } from './fixture';


const port = process.argv[2] ? Number(process.argv[2]) : 3000;
const portShifted = port + 42;

console.time('App listening on port ' + port);
console.time('MetaApp listening on port ' +  portShifted);
console.time('Connected to PostgresSQL instance');

// x-response-time
function xResponseTime() {
    return async (ctx, next) => {
	    const start = Date.now();
	    await next();
	    const ms = Date.now() - start;
	    ctx.set('X-Response-Time', `${ms}ms`);
    }
}

// logger
function logger(name) {
    return async (ctx, next) => {
        console.time(`${name} - ${ctx.method} ${ctx.url}`);
	    await next();
	    console.timeEnd(`${name} - ${ctx.method} ${ctx.url}`);
    }
}


(async() => {
	const connection = await createConnection().catch(e => console.log('TypeORM connection error: ', e));
	const app = new Koa();
	const metaApp = new Koa();

	console.timeEnd('Connected to PostgresSQL instance');

	fixture()();

	app.use(xResponseTime());
	metaApp.use(xResponseTime());

	app.use(logger('app'));
	metaApp.use(logger('meta'));

	app.use(helmet());
	metaApp.use(helmet());

// TODO: should know your domains here
	app.use(cors({origin: `*`}));
	metaApp.use(cors({origin: `*`}));

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

	app.listen(port, () => {
		console.timeEnd('App listening on port ' +  port );
	});

	metaApp.listen(portShifted, () => {
		console.timeEnd('MetaApp listening on port ' +  portShifted);
	});
})();
