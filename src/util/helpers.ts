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

export const enumerableColumnProperties: ColumnOptions = {type: 'varchar', length: 32};

export function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowerFistLetter (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
