import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import interviewerRouter from "./routes/InterviewerRoutes";
import identitiesRouter from "./routes/IdentityRoutes";
import respondentRouter from "./routes/RespondentRoutes";



const app = new Koa();
const port = process.argv[2] || 3000;

console.time('App listening on port '+  port );

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(helmet());

// routes
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

// app.use()