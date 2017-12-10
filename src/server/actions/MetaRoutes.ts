// import { Asset } from '../../models/asset';
// import { Item } from '../../models/item';
// import { Step } from '../../models/itemUse';
// import { Sequence } from '../../models/sequence';
import { respondentRouter } from './RespondentRoutes';
import { interviewerRouter } from './InterviewerActions';
import { identitiesRouter } from './IdentityRoutes';
import * as Router from 'koa-router';
import { AssetContentTypes, AssetTypes } from '../../entity/Asset';
import { ValidationTypes, TYPE_ValidationTypes, VALUE_ValidationTypes, META_VALUE_ValidationTypes } from '../../entity/FormatConstraint';
import { ItemLifeCycleTypes, QuantityOrder } from '../../entity/Item';
import { LogicTypes, StepTypes } from '../../entity/Step';

export const metaRouter = new Router();


// serve list of api routes
metaRouter.get('/routes', async(ctx, next) => {
	const knownRoutes = {
		respondentRoutes: respondentRouter.stack.map((r) => {
			return {
				path: r.path,
				params: r.paramNames,
				name: r.name,
			};
		}),
		interviewerRoutes: interviewerRouter.stack.map((r) => {
			return {
				path: r.path,
				params: r.paramNames,
				name: r.name,
			};
		}),
		identityRoutes: identitiesRouter.stack.map((r) => {
			return {
				path: r.path,
				params: r.paramNames,
				name: r.name,
			};
		}),

	};
	ctx.response.set('content-type', 'application/json');
	ctx.body = knownRoutes;

	next();
});

metaRouter.get('/types', async (ctx, next) => {
	const knownTypes = {
		AssetTypes: unpackEnum(AssetTypes),
		AssetContentTypes: unpackEnum(AssetContentTypes),
		ValidationTypes: unpackEnum(ValidationTypes),
		TYPE_ValidationTypes: unpackEnum(TYPE_ValidationTypes),
		VALUE_ValidationTypes: unpackEnum(VALUE_ValidationTypes),
		META_VALUE_ValidationTypes: unpackEnum(META_VALUE_ValidationTypes),
		ItemLifeCycleTypes: unpackEnum(ItemLifeCycleTypes),
		QuantityOrder: unpackEnum(QuantityOrder),
		StepTypes: unpackEnum(StepTypes),
		LogicTypes: unpackEnum(LogicTypes)
	};

	ctx.response.set('content-type', 'application/json');

	ctx.body = knownTypes;

	next();
});


function unpackEnum(en: {}) {
	return [...Object.keys(en)].map(k => en[k]);
};
