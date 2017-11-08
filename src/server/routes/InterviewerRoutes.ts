import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { SequenceControllerFactory } from '../controllers/SequencesController';
import { ItemControllerFactory } from '../controllers/ItemsController';
import { ItemUseControllerFactory } from '../controllers/ItemUsesController';
import { ItemUse } from '../../entity/ItemUse';
import { Sequence } from '../../entity/Sequence';


export const interviewerRouter = new Router();


(async () => {
	const Sequences =  await SequenceControllerFactory();
	const Items = await ItemControllerFactory();
	const ItemUses = await ItemUseControllerFactory();

	interviewerRouter.get('getSequences', '/Sequences', Sequences.list);
	interviewerRouter.get('getSequence', '/Sequences/:sequenceId', Sequences.one);

// interviewerRouter.get('getItems', '/items', items.list);
// interviewerRouter.get('getItem', '/items/:itemId', items.one);

	interviewerRouter.get('getAssets', '/assets', );
	interviewerRouter.get('getAsset', '/assets/:assetId', );

// interviewerRouter.get('/responses/:responseId');
// interviewerRouter.get('/responses/:responseId/:itemId');
// interviewerRouter.get('/responses/:sequenceId/:respondentId');
// interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

	interviewerRouter.post('addSequence', '/Sequences', koaBody(), Sequences.create);

	interviewerRouter.post('addNewItemToSequence', '/Sequences/:sequenceId', koaBody(), async (ctx, next) => {
		await Sequences.one(ctx);
		const sequence = ctx.body;

		ctx.request.body = <ItemUse> {
			item: ctx.request.body,
			sequence: sequence
		};

		await ItemUses.create(ctx);

		const newUse = ctx.body;



		ctx.request.body = <Sequence> {
			...sequence,
			use: sequence.use ? [...sequence.use, newUse] : [newUse]
		};

		await Sequences.update(ctx, next);

		await Sequences.one(ctx, next);
	});

	interviewerRouter.post('/responses');
	interviewerRouter.post('/responses/:responseId/:itemId');
	interviewerRouter.post('addAsset', '/assets', koaBody(), );

	interviewerRouter.patch('updateSequenceHeader', '/Sequences/:sequenceId', koaBody(), async (ctx, next) => {
		// ctx.body = await sequenceService.applyPatch(ctx.params.sequenceId, ctx.request.body)

		// const headerProps = ['name', 'description', 'sequenceMode'];
		//
		// const updatedHeader = {};
		//
		// for (const prop in ctx.request.body) {
		// 	if (headerProps.find(p => p === prop)) {
		// 		updatedHeader[prop] = ctx.request.body[prop]
		// 	}
		// }
		//
		// ctx.request.body = updatedHeader;
		//
		// ctx.body = await Sequences.update(ctx, next);
		await Sequences.update(ctx, next);
	});

	interviewerRouter.patch('updateItem', '/items/:itemId', koaBody(), async (ctx, next) => {
		// ctx.request.body.assets = ctx.request.body.assets.map(async (asset, index) => {
		// 	return await assets.upsert({request: {body: asset}})
		// });
		// next();
	}, );

	interviewerRouter.patch('updateUse', '/Sequences/:sequenceId/uses/:useIndex', koaBody(), async (ctx) => {
		// ctx.body = await itemsService.applyPatch(ctx.params.itemID, ctx.request.body)
	});

	interviewerRouter.delete('/Sequences/:sequenceId');
	interviewerRouter.delete('deleteItem', '/items/:itemId', async(ctx) => {
		// TODO: Delete item from db and clear refs
		ctx.body = ctx.params.itemId
	});
	interviewerRouter.delete('removeItem', 'Sequences/:sequenceId/:itemId', async(ctx) => {
		// TODO: remove item use
		ctx.body = ctx.params.itemId
	});

	interviewerRouter.delete('/assets/:assetId');
})();

