import { ColumnOptions } from 'typeorm';


export function xResponseTime() {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-SequenceResponse-Time', `${ms}ms`);
    };
}

export function logger(name) {
    return async (ctx, next) => {
        console.time(`${name} - ${ctx.method} ${ctx.url}`);
        await next();
        console.timeEnd(`${name} - ${ctx.method} ${ctx.url}`);
    };
}

export function trimObject(obj) {
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

export function trimmer() {
    return async (ctx, next) => {
        await next();
        ctx.body = trimObject(ctx.body);
    };
}

export const enumerableColumnProperties: ColumnOptions = {type: 'char', length: 32};
