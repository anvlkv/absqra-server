import { RouterManagerBase } from './RouterManagerBase';
import { EntityMetadata, FindManyOptions, FindOneOptions } from 'typeorm';
import { IMiddleware } from 'koa-router';
import { applyPatch, applyReducer, Operation, validate } from 'fast-json-patch';
import * as pluralize from 'pluralize';

export class CRUDRouterManager extends RouterManagerBase {
    get commandParamName(): string { return; }

    private populateDefaults(meta: EntityMetadata, cyclicEntities: string[] = []): any {
        const defaultEntity = {};
        try {
            if (meta.columns) {
                meta.columns.forEach(column => {
                    if (!column.isGenerated) {
                        const findColumnType = (t) => t === column.type;
                        const fallBackValue = (() => {
                            if (['float', 'double', 'dec', 'decimal', 'numeric', 'real', 'double precision', 'number'].find(findColumnType)) {
                                return 0
                            }
                            else if (['character varying', 'varying character', 'nvarchar', 'character', 'native character', 'varchar', 'char', 'nchar', 'varchar2', 'nvarchar2', 'tinytext', 'mediumtext', 'text', 'ntext', 'citext', 'longtext'].find(findColumnType)) {
                                return ''
                            }
                            else {
                                return null
                            }
                        })();

                        defaultEntity[column.propertyName] = column.hasOwnProperty('default') ? column.default : fallBackValue;
                    }
                });
            }
            if (meta.relations) {
                meta.relations.forEach(relation => {
                    if (!cyclicEntities.find(n => n === (<any>relation).type.name)) {
                        cyclicEntities.push((<any>relation).type.name);
                        if (!relation.isNullable) {
                            const defaultValue = this.populateDefaults(relation.inverseEntityMetadata, cyclicEntities);
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

    generateEntityMiddlewear(Repo, Entity, name, localPostfix): IMiddleware {
        return async (ctx, next) => {
            try {
                const id = ctx.params[`${name}Id`];

                if (id === 'default') {
                    ctx.body = this.populateDefaults(Repo.metadata);
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

                        for (let key in requestBodyFields) {
                            key = requestBodyFields[key];
                            entry[key] = ctx.request.body[key];
                        }

                        await Repo.save(entry);
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

                            const saveResult = await Repo.save(operationResult);

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
                        ctx.body = entry;
                        break;
                    }
                    default: {
                        throw new Error(`can not ${ctx.method} entity ${localPostfix}`);
                    }
                }

                return next();
            } catch (e) {
                RouterManagerBase.handleError(e, ctx, next, `entity${localPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        };
    }

    generateRepoMiddlewear (Repo, Entity, name, localPostfix, localPluralizedPostfix): IMiddleware {
        return async (ctx, next) => {
            try {
                const parentId = this.parentName ? ctx.params[`${this.parentName}Id`] : null;
                const findManyOptions: FindManyOptions<any> = {};
                if (this.parentName) {
                    findManyOptions.where = `"${this.parentName}Id"='${parentId}'`;
                }
                switch (ctx.method) {
                    case 'GET': {
                        ctx.body = await Repo.find(findManyOptions);
                        break;
                    }
                    case 'POST': {
                        const entry = new Entity(ctx.request.body);
                        const saveResult = await Repo.save(entry);

                        if (this.parentRepo && parentId) {
                            const parentEntry = await this.parentRepo.findOne(parentId);
                            const existingContent = await Repo.find(findManyOptions);
                            parentEntry[pluralize(name)] = existingContent || [];
                            parentEntry[pluralize(name)].push(entry);
                            const parentSaveResult = await this.parentRepo.save(parentEntry);
                            if (!parentSaveResult[pluralize(name)]) {
                                throw new Error(`[${pluralize(name)}] is not saved on [${this.parentName}] make sure to use the same names for both relation and related entity name`);
                            }
                        }

                        ctx.body = await Repo.findOne(entry.id);
                        break;
                    }
                    default: {
                        throw new Error(`can not ${ctx.method} on repo${localPluralizedPostfix}`);
                    }
                }

                return next();
            } catch (e) {
                RouterManagerBase.handleError(e, ctx, next, `repo${localPluralizedPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        };
    }
}

