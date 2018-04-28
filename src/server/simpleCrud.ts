import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { getConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { applyPatch, Operation, applyReducer, validate } from 'fast-json-patch';
import * as pluralize from 'pluralize';

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFistLetter (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function createCRUDRouterForEntities (entities: {[name: string]: any },
                                             crudPrefix = '',
                                             router = new Router(),
                                             routeNamePostfix?: string) {
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

        router.get(`getAll${localPluralizedPostfix}`, `${crudPrefix}/${pluralizedName}`, async (ctx, next) => {
            ctx.body = await Repo.find();
            next();
        });

        router.get(`get${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, async (ctx, next) => {
            ctx.body = await Repo.findOne(ctx.params[`${name}Id`]);
            next();
        });

        router.post(`new${localPostfix}`, `${crudPrefix}/${pluralizedName}`, koaBody(), async (ctx, next) => {
            const entry = new Entity(ctx.request.body);
            await Repo.save(entry);
            ctx.body = await Repo.findOne(entry.id);
            next();
        });

        router.post(`save${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, koaBody(), async (ctx, next) => {
            let entry = await Repo.findOne(ctx.params[`${name}Id`]);
            const requestBodyFields = Object.keys(ctx.request.body);

            for (const key in Object.keys(entry)) {
                if (requestBodyFields.indexOf(key) === -1) {
                    ctx.request.body[key] = null;
                }
            }

            entry = {
                ...entry,
                ...ctx.request.body
            };

            ctx.body = await Repo.save(entry);
            next();
        });

        router.patch(`update${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, koaBody(), async (ctx, next) => {
            const patchDocument: Operation[] = ctx.request.body;
            const entry = await Repo.findOne(ctx.params[`${name}Id`]);
            const patchErrors = validate(patchDocument, entry);
            if (!patchErrors) {
                let operationResult;

                if (!!(Repo.metadata.oneToManyRelations.length || Repo.metadata.manyToManyRelations.length)) {
                    operationResult = patchDocument.reduce(applyReducer, entry);
                }
                else {
                    operationResult = applyPatch(entry, patchDocument).newDocument;
                }

                ctx.body = await Repo.save(operationResult);
            }
            else {
                ctx.status = 400;
                ctx.body = patchErrors;
            }
            next();
        });

        router.delete(`delete${localPostfix}`, `${crudPrefix}/${pluralizedName}/:${name}Id`, async (ctx, next) => {
            const deletedEntry = await Repo.findOne(ctx.params[`${name}Id`]);
            await Repo.delete(ctx.params[`${name}Id`]);
            ctx.body = deletedEntry;
            next();
        });

        const relatedEntities = Repo.metadata.relations.reduce((related, meta) => {
            if (!meta.isOwning) {
                related[(<() => any>meta.type).name] = meta.type;
            }
            return related
        }, {});

        if (Object.keys(relatedEntities).length) {
            createCRUDRouterForEntities(relatedEntities, `${crudPrefix}/${pluralizedName}/:${name}Id`, router, localPostfix);
        }
    }

    return router;
}
