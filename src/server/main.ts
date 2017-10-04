import * as Koa from 'koa';
import * as mongoose from 'mongoose';

import interviewerRouter from "./routes/InterviewerRoutes";
import identitiesRouter from "./routes/IdentityRoutes";
import respondentRouter from "./routes/RespondentRoutes";

const MONGO_URI = 'mongodb://intervey-api:Passw0rd!@ds163034.mlab.com:63034/intervey-dev';

console.time('Connected to MongoDB instance');

mongoose.connect(MONGO_URI, {useMongoClient: true});
mongoose.connection
    .once('open', () => console.timeEnd('Connected to MongoDB instance'))
    .on('error', e => console.error('Can not connect to MongoDB: ', e));



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

// response
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