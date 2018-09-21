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
        console.log(tempEnv);
        break;
    default:
        tempEnv = dev.default;
        console.log(tempEnv);
        break;
}

console.info(`ENVIRONMENT: [${env}]`);

export const environment: {
    production?: boolean;
    secret?: string[];
    port?: number;
    host?: string;
    protocol?: string;
    apiPort?: number;
    clientPort?: number;
    wsprotocol?: string
} = tempEnv;
