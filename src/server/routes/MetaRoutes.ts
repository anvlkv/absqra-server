// import { Asset } from '../../models/asset';
// import { Item } from '../../models/item';
// import { ItemUse } from '../../models/itemUse';
// import { Sequence } from '../../models/sequence';
import { respondentRouter } from './RespondentRoutes';
import { interviewerRouter } from './InterviewerRoutes';
import { identitiesRouter } from './IdentityRoutes';
import * as Router from 'koa-router';
import { AssetContentTypes, AssetTypes } from '../../entity/Asset';
import { ItemModes, ItemTypes } from '../../entity/Item';
import { AssetsVisibilityModes, ItemUseModes } from '../../entity/ItemUse';
import { SequenceModes } from '../../entity/Sequence';

export const metaRouter = new Router();


// serve list of api routes
metaRouter.get('/routes', async(ctx, next) => {
	const knownRoutes = {
		respondentRoutes: respondentRouter.stack.map((r) => {
			return {
				path: r.path,
				params: r.paramNames,
				name: r.name
			}
		}),
		interviewerRoutes: interviewerRouter.stack.map((r) => {
			return {
				path: r.path,
				params: r.paramNames,
				name: r.name
			}
		}),
		identityRoutes: identitiesRouter.stack.map((r) => {
			return {
				path: r.path,
				params: r.paramNames,
				name: r.name
			}
		})

	};
	ctx.response.set('content-type', 'application/json');
	ctx.body = knownRoutes;

	next();
});

metaRouter.get('/types', async (ctx, next) => {
	const knownTypes = {
		AssetTypes: unpackEnum(AssetTypes),
		AssetContentTypes: unpackEnum(AssetContentTypes),
		ItemTypes: unpackEnum(ItemTypes),
		ItemModes: unpackEnum(ItemModes),
		ItemUseModes: unpackEnum(ItemUseModes),
		AssetsVisibilityModes: unpackEnum(AssetsVisibilityModes),
		SequenceModes: unpackEnum(SequenceModes)
	};

	ctx.response.set('content-type', 'application/json');

	ctx.body = knownTypes;

	next();
});


function unpackEnum(en: {}) {
	return [...Object.keys(en)].map(k => en[k])
};
