import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { FindOneOptions, getConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { applyPatch, Operation, applyReducer, validate } from 'fast-json-patch';
import * as pluralize from 'pluralize';
import { environment } from '../environments/environment';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { exportRoutes } from '../util/exportRoutes';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';

// TODO: export class CRUDRouterManager {
//
// }
function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFistLetter (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function handleError(err, ctx, next, debugContext?) {
    if (!environment.production) {
        ctx.body = {
            debugContext,
            err,
            request: ctx.request.body
        };
    }
    else {
        ctx.body = 'ERR'
    }
    ctx.status = 500;
    next();
}

function populateDefaults(meta: EntityMetadata, cyclicEntities: string[] = []): any {
    const defaultEntity = {};
    try {
        if (meta.columns) {
            meta.columns.forEach(column => {
                if (!column.isGenerated) {
                    defaultEntity[column.propertyName] = column.default || null;
                }
            });
        }
        if (meta.relations) {
            meta.relations.forEach(relation => {
                if (!cyclicEntities.find(n => n == (<any>relation).type.name)) {
                    cyclicEntities.push((<any>relation).type.name);
                    if (!relation.isNullable) {
                        const defaultValue = populateDefaults(relation.inverseEntityMetadata, cyclicEntities);
                        defaultEntity[relation.propertyName] = (relation.isOneToMany || relation.isManyToMany) ? [defaultValue] : defaultValue;
                    }
                    else {
                        defaultEntity[relation.propertyName] = null;
                    }
                }
            });
        }
    } catch (e) {
        console.error('creating default entity failed', e);
    }

    return defaultEntity;
}

export function createCRUDRouterForEntities (entities: {[name: string]: any },
                                             crudPrefix = '',
                                             exportGeneratedRoutes = false,
                                             router = new Router(),
                                             routeNamePostfix = '',
                                             parentName?: string) {
    const generateRouterNamePostfix = function (name) {
        let namePostfix = '';
        if (routeNamePostfix) {
            namePostfix = `${capitalizeFirstLetter(name)}Of${routeNamePostfix}`;
        }
        else {
            namePostfix = capitalizeFirstLetter(name)
        }
        return namePostfix;
    };

    if (crudPrefix && crudPrefix[0] != '/') {
        crudPrefix = `/${crudPrefix}`
    }



    for (const entityName in entities) {
        let Repo: Repository<any>;

        try {
            Repo = getConnection().getRepository(entities[entityName]);
        } catch (e) {
            console.error(e);
            throw new Error(`${entityName} is not an Entity... or cannot get repo`);
        }

        const name = lowerFistLetter(entityName);
        const Entity = entities[entityName];
        const localPostfix = generateRouterNamePostfix(name);
        const pluralizedName = pluralize(name);
        const localPluralizedPostfix = generateRouterNamePostfix(pluralizedName);
        const defaultEntity = populateDefaults(Repo.metadata);


        router.register(`${crudPrefix}/${pluralizedName}`, ['GET', 'POST'], async (ctx, next) => {
            try {
                switch (ctx.method) {
                    case 'GET': {
                        const findManyOptions: FindManyOptions<any> = {};
                        if (parentName) {
                            findManyOptions.where = `"${parentName}Id"=${ctx.params[`${parentName}Id`]}`;
                        }
                        ctx.body = await Repo.find(findManyOptions);
                        break;
                    }
                    case 'POST': {
                        const entry = new Entity(ctx.request.body);
                        await Repo.save(entry);
                        ctx.body = await Repo.findOne(entry.id);
                        break;
                    }
                    default: {
                        throw new Error(`can not ${ctx.method} on repo${localPluralizedPostfix}`);
                    }
                }

                return next();
            } catch (e) {
                handleError(e, ctx, next, `repo${localPluralizedPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        }, {name: `repo${localPluralizedPostfix}`});

        router.register(`${crudPrefix}/${pluralizedName}/:${name}Id`, ['GET', 'POST', 'PATCH', 'DELETE'], async (ctx, next) => {
            try {
                const id = Number(ctx.params[`${name}Id`]);

                if (id === 0) {
                    ctx.body = defaultEntity;
                    return;
                }
                const entry = await Repo.findOne(id);

                switch (ctx.method) {
                    case 'GET': {
                        ctx.body = entry;
                        break;
                    }
                    case 'POST': {
                        const requestBodyFields = Object.keys(ctx.request.body);

                        console.log(requestBodyFields);

                        for (let key in requestBodyFields) {
                            key = requestBodyFields[key];
                            entry[key] = ctx.request.body[key];
                        }

                        const saveResult = await Repo.save(entry);
                        // console.log(saveResult);
                        ctx.body = await Repo.findOne(id);
                        break;
                    }
                    case 'PATCH': {
                        const patchDocument: Operation[] = ctx.request.body;
                        const patchErrors = validate(patchDocument, entry);
                        if (!patchErrors) {
                            let operationResult;

                            if (!!(Repo.metadata.oneToManyRelations.length || Repo.metadata.manyToManyRelations.length)) {
                                operationResult = patchDocument.reduce(applyReducer, entry);
                            }
                            else {
                                operationResult = applyPatch(entry, patchDocument).newDocument;
                            }

                            const saveResult = await Repo.save(entry);
                            // console.log(saveResult);

                            ctx.body = await Repo.findOne(id);
                        }
                        else {
                            ctx.status = 400;
                            ctx.body = patchErrors;
                        }
                        break;
                    }
                    case 'DELETE': {

                        const deleteResult = await Repo.delete(id);
                        // console.log(deleteResult);
                        ctx.body = entry;
                        break;
                    }
                    default: {
                        throw new Error(`can not ${ctx.method} on repo${localPluralizedPostfix}`);
                    }
                }

                return next();
            } catch (e) {
                handleError(e, ctx, next, `entity${localPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        }, {name: `entity${localPostfix}`});


        const relatedEntities = Repo.metadata.relations.reduce((related, meta) => {
            if (!meta.isOwning) {

                related[(<() => any> meta.type).name] = meta.type;
            }
            return related
        }, {});

        if (Object.keys(relatedEntities).length) {
            createCRUDRouterForEntities(relatedEntities, `${crudPrefix}/${pluralizedName}/:${name}Id`, false, router, localPostfix, name);
        }
    }

    if (exportGeneratedRoutes) {
        exportRoutes(router, 'CRUDRouter');
    }

    return router;
}
