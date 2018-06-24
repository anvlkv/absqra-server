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

const routesPerEntry = 6;

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFistLetter (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function handleError(e, ctx, next) {
    if (!environment.production) {
        ctx.body = e;
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
                defaultEntity[column.propertyName] = column.default || null;
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


        router.get(`getAll${localPluralizedPostfix}`, `${crudPrefix}/${pluralizedName}`, async (ctx, next) => {
            const findManyOptions: FindManyOptions<any> = {};

            if (parentName) {
                findManyOptions.where = `"${parentName}Id"=${ctx.params[`${parentName}Id`]}`;
            }

            try {
                ctx.body = await Repo.find(findManyOptions);
            } catch (e) {
                handleError(e, ctx, next);
            }
        });

        router.get(`get${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, async (ctx, next) => {
            try {
                const itemId = Number(ctx.params[`${name}Id`]);
                if (itemId === 0) {
                    ctx.body = defaultEntity;
                }
                else {
                    ctx.body = await Repo.findOne(itemId);
                }
            } catch (e) {
                handleError(e, ctx, next);
            }
        });

        router.post(`new${localPostfix}`, `${crudPrefix}/${pluralizedName}`, koaBody(), async (ctx, next) => {
            try {
                const entry = new Entity(ctx.request.body);
                await Repo.save(entry);
                ctx.body = await Repo.findOne(entry.id);
            } catch (e) {
                handleError(e, ctx, next);
            }
        });

        router.post(`save${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, koaBody(), async (ctx, next) => {
            try {
                const id = ctx.params[`${name}Id`];
                const entry = await Repo.findOne(id);
                const requestBodyFields = Object.keys(ctx.request.body);

                for (let key in requestBodyFields) {
                    key = requestBodyFields[key];
                    entry[key] = ctx.request.body[key];
                }

                await Repo.save(entry);

                ctx.body = await Repo.findOne(id);
            } catch (e) {
                handleError(e, ctx, next);
            }
        });

        router.patch(`update${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, koaBody(), async (ctx, next) => {
            try {
                const patchDocument: Operation[] = ctx.request.body;
                const id: number = ctx.params[`${name}Id`];
                const entry = await Repo.findOne(id);
                const patchErrors = validate(patchDocument, entry);
                if (!patchErrors) {
                    let operationResult;

                    if (!!(Repo.metadata.oneToManyRelations.length || Repo.metadata.manyToManyRelations.length)) {
                        operationResult = patchDocument.reduce(applyReducer, entry);
                    }
                    else {
                        operationResult = applyPatch(entry, patchDocument).newDocument;
                    }

                    await Repo.save(operationResult);

                    ctx.body = await Repo.findOne(id);
                }
                else {
                    ctx.status = 400;
                    ctx.body = patchErrors;
                }

            } catch (e) {
                handleError(e, ctx, next);
            }
        });

        router.delete(`delete${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, async (ctx, next) => {
            const deletedEntry = await Repo.findOne(ctx.params[`${name}Id`]);
            await Repo.delete(ctx.params[`${name}Id`]);
            ctx.body = deletedEntry;
        });

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
