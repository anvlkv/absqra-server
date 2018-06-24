/// <reference types="koa-router" />
import * as Router from 'koa-router';
export declare function createCRUDRouterForEntities(entities: {
    [name: string]: any;
}, crudPrefix?: string, exportGeneratedRoutes?: boolean, router?: Router, routeNamePostfix?: string, parentName?: string): Router;
