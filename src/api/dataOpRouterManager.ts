import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { EntityBase, RouterManagerBase } from './RouterManagerBase';
import { IEntityBase } from '../entity';

export enum DataOperationTypes {
    CLONE = 'clone'
}

export class DataOpRouterManager extends RouterManagerBase {
    get commandParamName() { return 'operationType'; }

    private async cloneEntity(Repo: Repository<IEntityBase>, Entity: EntityBase, sourceEntryPromise: Promise<IEntityBase>, deep = false): Promise<IEntityBase> {
        const sourceEntry = await sourceEntryPromise;
        for (const r in Repo.metadata.relations) {
            const relationMetadata = Repo.metadata.relations[r];
            const relatedEntitySource = sourceEntry[relationMetadata.propertyName];
            const RelatedEntity = <EntityBase>relationMetadata.type;
            if (relationMetadata.isOwning) {
                switch (relationMetadata.relationType) {
                    case 'one-to-one': {
                        try {
                            sourceEntry[relationMetadata.propertyName] = await this.cloneEntity(getRepository(RelatedEntity), RelatedEntity, relatedEntitySource, deep);
                        } catch (e) {
                            throw new Error(`cloneEntity failed with [${Repo.metadata.name}], [${sourceEntry}], [deep=${deep}], [${relationMetadata.relationType}], ERR: [${e}]`);
                        }
                        break;
                    }
                    case 'one-to-many': {}
                    case 'many-to-many': {
                        if (relationMetadata.inverseRelation.isOneToOne || deep) {
                            for (const i in relatedEntitySource) {
                                const el = relatedEntitySource[i];
                                try {
                                    sourceEntry[relationMetadata.propertyName][i] = await this.cloneEntity(getRepository(RelatedEntity), RelatedEntity, el, deep)
                                } catch (e) {
                                    throw new Error(`cloneEntity failed with [${Repo.metadata.name}], [${sourceEntry}], [deep=${deep}], [${relationMetadata.relationType}], ERR: [${e}]`);
                                }
                            }
                        }
                        break;
                    }
                    default: {
                        if (deep) {
                            if (relatedEntitySource instanceof Array) {
                                for (const i in relatedEntitySource) {
                                    const el = relatedEntitySource[i];
                                    try {
                                        sourceEntry[relationMetadata.propertyName][i] = await this.cloneEntity(getRepository(RelatedEntity), RelatedEntity, el, deep)
                                    } catch (e) {
                                        throw new Error(`cloneEntity failed with [${Repo.metadata.name}], [${sourceEntry}], [deep=${deep}], [${relationMetadata.relationType}], ERR: [${e}]`);
                                    }
                                }
                            }
                            else {
                                try {
                                    sourceEntry[relationMetadata.propertyName] = await this.cloneEntity(getRepository(RelatedEntity), RelatedEntity, relatedEntitySource, deep);
                                } catch (e) {
                                    throw new Error(`cloneEntity failed with [${Repo.metadata.name}], [${sourceEntry}], [deep=${deep}], [${relationMetadata.relationType}], ERR: [${e}]`);
                                }
                            }
                        }
                        break;
                    }
                }
            }
            else {
                sourceEntry[relationMetadata.propertyName] = null;
            }
        }

        return Repo.save(new Entity(sourceEntry))
    }

    generateEntityMiddlewear(Repo: Repository<IEntityBase>, Entity: EntityBase, name: string, localPostfix?: string): Router.IMiddleware {
        return async(ctx, next) => {
            try {
                const operationType: DataOperationTypes = ctx.params['operationType'];
                const sourceEntryId = ctx.params[`${name}Id`];
                const sourceEntry = Repo.findOne(sourceEntryId);
                switch (operationType) {
                    case DataOperationTypes.CLONE: {
                        ctx.body = await this.cloneEntity(Repo, Entity, sourceEntry);
                        break;
                    }
                }
                return next();
            } catch (e) {
                RouterManagerBase.handleError(e, ctx, next, `entity${localPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        };
    }

    generateRepoMiddlewear(Repo: Repository<IEntityBase>, Entity: EntityBase, name: string, localPostfix: string, localPluralizedPostfix: string): Router.IMiddleware {
        return async(ctx, next) => {
            try {
                console.log('repo');

                return next();
            } catch (e) {
                RouterManagerBase.handleError(e, ctx, next, `repo${localPluralizedPostfix}|${ctx.method}:${ctx.req.url}`);
            }
        };
    }



}
