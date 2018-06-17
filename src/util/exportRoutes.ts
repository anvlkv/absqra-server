import * as fs from 'fs';
import * as Router from 'koa-router';

export function exportRoutes(router: Router, name: string) {
    const msg = `routes exported to /lib/router/${name}.ts`;
    console.time(msg);

    let fileContent = router.stack.reduce((content, layer, at, all): string => {
        // unindent
        return `${content}
    ${layer.name}: {
        path: '${layer.path}',
        params: [${layer.paramNames.map(param => `'${param.name}'`).join(', ')}],
    }${at < all.length - 1 ? ',' : '\n'}`
    }, `export const ${name} = {`);

    fileContent += '};\n';


    fs.writeFile(`lib/router/${name}.ts`, fileContent, function(err) {
        if (err) {
            return console.error(err);
        }
        else {
            console.timeEnd(msg);
        }
    });
}
