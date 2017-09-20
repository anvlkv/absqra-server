import * as Koa from 'koa';
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

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(port, ()=>{
    console.timeEnd('App listening on port '+  port );
});

// app.use()