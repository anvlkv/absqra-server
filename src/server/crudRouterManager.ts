import * as Router from 'koa-router';
import { getConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { applyPatch, Operation, applyReducer, validate } from 'fast-json-patch';
import * as pluralize from 'pluralize';
import { environment } from '../environments/environment';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';

export class CRUDRouterManager {

    private children: CRUDRouterManager[] = [];

    private readonly entities: {[name: string]: any };

    private readonly parentName: string;

    constructor(
        entities: {[name: string]: any },
        private readonly crudPrefix = '',
        public router = new Router(),
        private routeNamePostfix = '',
        private parentRepo: Repository<any> = null,
        parentEntities = {},
        private root: CRUDRouterManager = null
    ) {
        if (parentRepo) {
            this.parentName = lowerFistLetter(parentRepo.metadata.name);
        }

        this.entities = {
            ...parentEntities,
            ...entities
        };

        if (this.crudPrefix[0] !== '/') {
           this.crudPrefix = `/${this.crudPrefix}`
        }

        for (const entityName in entities) {
            this.registerEntity(entityName);
            this.registerRepo(entityName);
        }

        for (const entityName in entities) {
            this.registerRelations(entityName);
        }
    }

    public addEntity(entity: Function) {
        this.entities[entity.name] = entity;
        this.registerEntity(entity.name);
        this.addRepo(entity);
    }

    public addRepo(entity: Function) {
        this.entities[entity.name] = entity;
        this.registerRepo(entity.name);
    }

    public registerEntity(entityName: string) {
        let Repo: Repository<any>;
        const entity = this.entities[entityName];

        if (!entity.isEntityRegistered) {
            try {
                Repo = getConnection().getRepository(entity);
            } catch (e) {
                console.error(e);
                throw new Error(`${entityName} is not an Entity... or cannot get repo`);
            }
            this.registerEntityRouter(Repo, this.entities[entityName]);

            Object.defineProperty(this.entities[entityName], 'isEntityRegistered', {value: true, writable: false})
        }
    }

    public registerRepo(entityName: string) {
        let Repo: Repository<any>;
        const entity = this.entities[entityName];

        if (entity.isRepoRegistered) {
            throw new Error(`repo [${entityName}] is already registered`);
        }
        try {
            Repo = getConnection().getRepository(entity);
        } catch (e) {
            console.error(e);
            throw new Error(`${entityName} is not an Entity... or cannot get repo`);
        }

        this.registerRepoRouter(Repo, this.entities[entityName]);
    }

    private registerRelations(entityName: string) {
        let Repo: Repository<any>;
        const entity = this.entities[entityName];

        try {
            Repo = getConnection().getRepository(entity);
        } catch (e) {
            console.error(e);
            throw new Error(`${entityName} is not an Entity... or cannot get repo`);
        }

        this.registerRelationRouter(Repo, this.entities[entityName]);
    }

    private registerRelationRouter(Repo: Repository<any>, Entity: Function) {
        const name = lowerFistLetter(Entity.name);
        const localPostfix = this.generateRouterNamePostfix(name);
        const pluralizedName = pluralize(name);

        const relatedRoutesTask = Repo.metadata.relations.reduce((related, meta) => {
            const relationName = (<Function>meta.type).name;
            if (!this.entities[relationName]) {
                if (meta.isManyToOne || meta.isOneToOne) {
                    related.entities[relationName] = meta.type;
                }
                else if (!meta.isOwning) {
                    related.repos[relationName] = meta.type;
                }


            }
            return related
        }, {repos: {}, entities: {}});


        for (const entityName in relatedRoutesTask.entities) {
            this.addEntity(relatedRoutesTask.entities[entityName]);
        }

        if (Object.keys(relatedRoutesTask.repos).length) {
            this.children.push(
                new CRUDRouterManager(
                    relatedRoutesTask.repos,
                    `${this.crudPrefix}/${pluralizedName}/:${name}Id`,
                    this.router,
                    localPostfix,
                    Repo,
                    this.entities,
                    this.root || this)
            )
        }
    }

    private generateRouterNamePostfix (name: string) {
        let namePostfix = '';
        if (this.routeNamePostfix) {
            namePostfix = `${capitalizeFirstLetter(name)}Of${this.routeNamePostfix}`;
        }
        else {
            namePostfix = capitalizeFirstLetter(name)
        }
        return namePostfix;
    }

    private registerEntityRouter(Repo: Repository<any>, Entity: Function) {
        const name = lowerFistLetter(Entity.name);
        const localPostfix = capitalizeFirstLetter(name);
        const pluralizedName = pluralize(name);
        const prefix = this.root ? this.root.crudPrefix : this.crudPrefix;
        this.router.register(`${prefix}/${pluralizedName}/:${name}Id`, ['GET', 'POST', 'PATCH', 'DELETE'], this.generateEntityMiddlewear(Repo, Entity, name, localPostfix), {name: `entity${localPostfix}`});
    }

    private registerRepoRouter(Repo: Repository<any>, Entity: Function) {
        const name = lowerFistLetter(Entity.name);
        const pluralizedName = pluralize(name);
        const localPluralizedPostfix = this.generateRouterNamePostfix(pluralizedName);

        this.router.register(`${this.crudPrefix}/${pluralizedName}`, ['GET', 'POST'], this.generateRepoMiddlewear(Repo, Entity, name, localPluralizedPostfix, this.parentName), {name: `repo${localPluralizedPostfix}`});
    }

    private generateEntityMiddlewear (Repo: Repository<any>, Entity: Function, name: string, localPostfix?: string) {
        const middlewear = async (ctx, next) => {
            try {
                const id = ctx.params[`${name}Id`];

                if (id === 'default') {
                    ctx.body = populateDefaults(Repo.metadata);
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

                        const saveResult = await Repo.save(entry);
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
                        throw new Error(`can not ${ctx.method} on entity ${localPostfix}`);
                    }
                }

                return next();
            } catch (e) {
                handleError(e, ctx, next, `entity${localPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        };

        Object.defineProperty(middlewear, 'name', {value: name, writable: false});

        return middlewear;
    }

    private generateRepoMiddlewear (Repo: Repository<any>, Entity, name: string, localPostfix = '', localPluralizedPostfix = '') {
        const middlewear = async (ctx, next) => {
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
                handleError(e, ctx, next, `repo${localPluralizedPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        };

        Object.defineProperty(middlewear, 'name', {value: name, writable: false});

        return middlewear;
    }

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

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFistLetter (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

