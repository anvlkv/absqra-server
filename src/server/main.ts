import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import interviewerRouter from "./routes/InterviewerRoutes";
import identitiesRouter from "./routes/IdentityRoutes";
import respondentRouter from "./routes/RespondentRoutes";
import * as Router from 'koa-router';



const app = new Koa();
const metaApp = new Koa();
const port = process.argv[2] ? Number(process.argv[2]) : 3000;
const portShifted = port + 42;
const metaRouter = new Router();

console.time('App listening on port '+ port);
console.time('MetaApp listening on port '+  portShifted);

// x-response-time

function xResponseTyme(){
    return async (ctx, next) => {
	    const start = Date.now();
	    await next();
	    const ms = Date.now() - start;
	    ctx.set('X-Response-Time', `${ms}ms`);
    }
}

app.use(xResponseTyme());
metaApp.use(xResponseTyme());


// logger

function logger(name){
    return async (ctx, next) => {
        console.time(`${name} - ${ctx.method} ${ctx.url}`);
	    await next();
	    console.timeEnd(`${name} - ${ctx.method} ${ctx.url}`);
    }
}

app.use(logger('app'));
metaApp.use(logger('meta'));

app.use(helmet());
metaApp.use(helmet());

//TODO: should know your domains here
app.use(cors({origin:`*`}));
metaApp.use(cors({origin:`*`}));



metaRouter.get('/routes', async(ctx, next)=>{
    const knownRoutes = {
        respondentRoutes:respondentRouter.stack.map((r) => {
		    return {
			    path: r.path,
			    params: r.paramNames,
                name: r.name
		    }
	    }),
	    interviewerRoutes:interviewerRouter.stack.map((r) => {
		    return {
			    path: r.path,
			    params: r.paramNames,
			    name: r.name
		    }
	    }),
	    identityRoutes:identitiesRouter.stack.map((r) => {
		    return {
			    path: r.path,
			    params: r.paramNames,
			    name: r.name
		    }
	    })

    };
	ctx.response.set('content-type', 'application/json');
    ctx.body = knownRoutes;
});


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


// app.use(async (ctx, next) => {
//     // if(ctx.url == '/')
//     //     ctx.body = 'Hello World';
//
//     await next();
// });





app.listen(port, ()=>{
    console.timeEnd('App listening on port '+  port );
});

metaApp.listen(portShifted, ()=>{
	console.timeEnd('MetaApp listening on port '+  portShifted);
});


// app.use()