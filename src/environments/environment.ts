import * as dev from './environment.dev';
import * as prod from './environment.prod';
import * as debug from './environment.debug';

const env = process.env.ENVIRONMENT;
let tempEnv;
switch (env) {
    case 'prod':
        tempEnv = prod.default;
        break;
    case 'debug':
        tempEnv = debug.default;
        break;
    default:
        tempEnv = dev.default;
        break;
}

export const environment = tempEnv;
