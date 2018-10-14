import { environment } from './environments/environment';
import { startWebServer } from './server/webServer';
import { startApiServer } from './server/apiServer';

(async () => {
    await startApiServer();

    if (environment.port) {
        startWebServer();
    }
    else {
        console.warn(`Use client at ${environment.clientPort} or specify environment.port`);
    }
})();
