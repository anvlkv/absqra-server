import * as Router from 'koa-router';
import { BaseEntity, getConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import * as pluralize from 'pluralize';
import { environment } from '../environments/environment';
import { capitalizeFirstLetter, lowerFistLetter } from '../util/helpers';
import { IMiddleware } from 'koa-router';
import { IEntityBase } from '../entity';

export interface EntityBase extends BaseEntity {
    new (data: any): IEntityBase
}

export abstract class RouterManagerBase {

    private children: RouterManagerBase[] = [];

    private readonly entities: {[name: string]: any };

    public readonly parentName: string;

    private _registeredEntities: string[];

    public get registeredEntities(): string[] {
        if (this.root) {
            return this.root.registeredEntities;
        }
        else {
            return this._registeredEntities;
        }
    }


    static handleError(err, ctx, next, debugContext?) {
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

    abstract generateEntityMiddlewear(Repo: Repository<IEntityBase>, Entity: EntityBase, name: string, localPostfix?: string): IMiddleware;

    abstract generateRepoMiddlewear (Repo: Repository<IEntityBase>, Entity: EntityBase, name: string, localPostfix: string, localPluralizedPostfix: string): IMiddleware;

    abstract get commandParamName (): string;

    constructor(
        entities: {[name: string]: any },
        public entityMethods: string[],
        public repoMethods: string[],
        public readonly routerPrefix = '',
        public router = new Router(),
        public routeNamePostfix = '',
        public parentRepo: Repository<IEntityBase> = null,
        public parentEntities = {},
        public root: RouterManagerBase = null
    ) {
        if (parentRepo) {
            this.parentName = lowerFistLetter(parentRepo.metadata.name);
        }

        if (!this.root) {
           this._registeredEntities = [];
        }

        this.entities = {
            ...parentEntities,
            ...entities
        };

        if (this.routerPrefix[0] !== '/') {
            this.routerPrefix = `/${this.routerPrefix}`
        }

        for (const entityName in entities) {
            this.registerEntity(entityName);
            this.registerRepo(entityName);
            this.registerRelations(entityName);
        }
    }

    public addEntity(Entity: EntityBase, alias?: string, Parent?: EntityBase) {
        if (alias && Parent) {
            this.registerEntityAlias(alias, Parent, Entity)
        }
        else if (!alias && !Parent) {
            this.entities[Entity.name] = Entity;
            this.registerEntity(Entity.name);
            this.addRepo(Entity);
        }
        else {
            throw new Error('don\'t know what to do here');
        }
    }

    public addRepo(Entity: Function) {
        this.entities[Entity.name] = Entity;
        this.registerRepo(Entity.name);
    }

    public registerEntity(entityName: string) {
        let Repo: Repository<IEntityBase>;
        const entity = this.entities[entityName];

        if (!this.isEntityRegistered(entityName)) {
            try {
                Repo = getConnection().getRepository(entity);
            } catch (e) {
                console.error(e);
                throw new Error(`${entityName} is not an Entity... or cannot get repo`);
            }
            this.registerEntityRouter(Repo, entity);

            this.registeredEntities.push(entityName);
        }
    }

    public registerEntityAlias(alias: string, Parent: EntityBase, Entity: EntityBase) {
        let Repo: Repository<IEntityBase>;
        if (!this.isEntityRegistered(alias)) {
            try {
                Repo = getConnection().getRepository(Entity);
            } catch (e) {
                console.error(e);
                throw new Error(`${alias}: ${Entity.name} is not an Entity... or cannot get repo`);
            }
            this.registerAliasRouter(alias, Parent, Repo, Entity);

            this.registeredEntities.push(alias);
        }
    }

    public registerAliasRouter(aliasName: string, Parent: EntityBase, Repo: Repository<IEntityBase>, Entity: EntityBase) {
        const Manager: any = this.constructor;
        const parentName = lowerFistLetter(Parent.name);
        const pluralizedParentName = pluralize(Parent.name);
        const localPostfix = this.generateRouterNamePostfix(parentName);
        const alias = {};
        alias[aliasName] = Entity;



        // new Repository()

        //    constructor(
        //         entities: {[name: string]: any },
        //         public entityMethods: string[],
        //         public repoMethods: string[],
        //         public readonly routerPrefix = '',
        //         public router = new Router(),
        //         public routeNamePostfix = '',
        //         public parentRepo: Repository<IEntityBase> = null,
        //         public parentEntities = {},
        //         public root: RouterManagerBase = null
        //     ) {

        // this.children.push(
        //     new Manager(
        //         alias,
        //         this.entityMethods,
        //         this.repoMethods,
        //         `${this.routerPrefix}/${pluralizedParentName}/:${parentName}Id`,
        //         this.router,
        //         localPostfix,
        //         Repo)
        // )
        // const name = lowerFistLetter(alias);
        // const localPostfix = capitalizeFirstLetter(name);
        // const middlewear = this.generateEntityMiddlewear(Repo, Entity, name, localPostfix, lowerFistLetter(parent));
        // const suffix = this.commandParamName ?  `/:${this.commandParamName}` : '';
        // Object.defineProperty(middlewear, 'name', {value: Entity.name, writable: false});
        // this.router.register(`${this.routerPrefix}/${lowerFistLetter(parent)}/:${lowerFistLetter(parent)}Id/${name}${suffix}`, this.repoMethods, middlewear, {name: `entity${localPostfix}Of${capitalizeFirstLetter(parent)}`});
    }

    public registerRepo(entityName: string) {
        let Repo: Repository<IEntityBase>;
        const entity = this.entities[entityName];

        try {
            Repo = getConnection().getRepository(entity);
        } catch (e) {
            console.error(e);
            throw new Error(`${entityName} is not an Entity... or cannot get repo`);
        }

        this.registerRepoRouter(Repo, this.entities[entityName]);
    }

    private isEntityRegistered(entityName: string): boolean {
        return this.registeredEntities.indexOf(entityName) >= 0;
    }

    private registerRelations(entityName: string) {
        let Repo: Repository<IEntityBase>;
        const entity = this.entities[entityName];

        try {
            Repo = getConnection().getRepository(entity);
        } catch (e) {
            console.error(e);
            throw new Error(`${entityName} is not an Entity... or cannot get repo`);
        }

        this.registerRelationRouter(Repo, this.entities[entityName]);
    }

    private registerRelationRouter(Repo: Repository<IEntityBase>, Entity: EntityBase) {
        const name = lowerFistLetter(Entity.name);
        const localPostfix = this.generateRouterNamePostfix(name);
        const pluralizedName = pluralize(name);
        const Manager: any = this.constructor;

        const relatedRoutesTask = Repo.metadata.relations.reduce((related, rel) => {
            const relationName = (<Function>rel.type).name;
            if (rel.isManyToOne || rel.isOneToOne) {
                if (!this.entities[relationName]) {
                    related.entities[relationName] = rel.type;
                }
                // else if (rel.isOwning && rel.isOneToOne && typeof rel.type === 'function') {
                //     related.entityAs[rel.propertyName] = rel.type;
                // }
                else {
                    related.skipped[relationName] = rel.type;
                }
            }
            else if ((!rel.isOwning && !rel.isTreeChildren) || (rel.isTreeChildren && !this.isEntityRegistered(relationName))) {
                related.repos[relationName] = rel.type;
            }
            else {
                related.skipped[relationName] = rel.type;
            }
            return related
        }, {repos: {}, entities: {}, entityAs: {}, skipped: {}});


        for (const entityName in relatedRoutesTask.entities) {
            this.addEntity(relatedRoutesTask.entities[entityName]);
        }

        for (const entityName in relatedRoutesTask.entityAs) {
            this.addEntity(relatedRoutesTask.entityAs[entityName], entityName, Entity);
        }

        if (Object.keys(relatedRoutesTask.repos).length) {
            this.children.push(
                new Manager(
                    relatedRoutesTask.repos,
                    this.entityMethods,
                    this.repoMethods,
                    `${this.routerPrefix}/${pluralizedName}/:${name}Id`,
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

    private registerEntityRouter(Repo: Repository<IEntityBase>, Entity: EntityBase) {
        const name = lowerFistLetter(Entity.name);
        const localPostfix = capitalizeFirstLetter(name);
        const pluralizedName = pluralize(name);
        const prefix = this.root ? this.root.routerPrefix : this.routerPrefix;
        const middlewear = this.generateEntityMiddlewear(Repo, Entity, name, localPostfix);
        const suffix = this.commandParamName ?  `/:${this.commandParamName}` : '';
        Object.defineProperty(middlewear, 'name', {value: name, writable: false});
        this.router.register(`${prefix}/${pluralizedName}/:${name}Id${suffix}`, this.entityMethods, middlewear, {name: `entity${localPostfix}`});
    }

    private registerRepoRouter(Repo: Repository<IEntityBase>, Entity: EntityBase) {
        const name = lowerFistLetter(Entity.name);
        const pluralizedName = pluralize(name);
        const localPluralizedPostfix = this.generateRouterNamePostfix(pluralizedName);
        const middlewear = this.generateRepoMiddlewear(Repo, Entity, name, localPluralizedPostfix, this.parentName);
        const suffix = this.commandParamName ?  `/:${this.commandParamName}` : '';
        Object.defineProperty(middlewear, 'name', {value: name, writable: false});
        this.router.register(`${this.routerPrefix}/${pluralizedName}${suffix}`, this.repoMethods, middlewear, {name: `repo${localPluralizedPostfix}`});
    }

}

