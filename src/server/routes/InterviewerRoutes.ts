import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { SequenceControllerFactory } from '../controllers/SequencesController';
import { ItemControllerFactory } from '../controllers/ItemsController';
import { StepsControllerFactory } from '../controllers/StepsController';
import { Step } from '../../entity/Step';
import { AssetControllerFactory } from '../controllers/AssetsController';
import { Asset } from '../../entity/Asset';


export const interviewerRouter = new Router();


(async () => {
	const Sequences =  await SequenceControllerFactory();
	const Items = await ItemControllerFactory();
	const Steps = await StepsControllerFactory();
	const Assets = await AssetControllerFactory();

	interviewerRouter.get('getSequences', '/Sequences', Sequences.list);
	interviewerRouter.get('getSequence', '/Sequences/:sequenceId', Sequences.one);

	interviewerRouter.get('getItems', '/items', Items.list);
	interviewerRouter.get('getItem', '/items/:itemId', Items.one);

	interviewerRouter.get('getAssets', '/assets', Assets.list);
	interviewerRouter.get('getAsset', '/assets/:assetId', Assets.one);

	interviewerRouter.get('getStep', '/steps/:stepId', Steps.one);


// interviewerRouter.get('/responses/:responseId');
// interviewerRouter.get('/responses/:responseId/:itemId');
// interviewerRouter.get('/responses/:sequenceId/:respondentId');
// interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

	interviewerRouter.post('addSequence', '/Sequences', koaBody(), Sequences.create);

	interviewerRouter.post('addNewItemToSequence', '/Sequences/:sequenceId/items', koaBody(), async (ctx, next) => {
		await Sequences.one(ctx);
		const step = new Step();
		const sequence = ctx.body;

		step.item = ctx.request.body;
		step.order = ctx.body.steps.length;

		ctx.request.body = step;

		await Steps.save(ctx);

		ctx.request.body = {
			...sequence,
			steps: [...sequence.steps, step]
		};

		await Sequences.save(ctx);

		ctx.params.stepId = step.id;

		await Steps.one(ctx, next);
	});

	// interviewerRouter.post('/responses');
	// interviewerRouter.post('/responses/:responseId/:itemId');

	interviewerRouter.post('addAssetToItem', '/items/:itemId/assets', koaBody(), async (ctx, next) => {
		await Items.one(ctx);
		const item = ctx.body;

		await Assets.create(ctx);
		const asset = ctx.body;

		item.assets = item.assets ? [...item.assets, asset] : [asset];

		ctx.request.body = item;

		await Items.save(ctx);

		ctx.body = asset;
		next();
	});

	interviewerRouter.post('addAsset', '/assets', koaBody(), Assets.create);

	interviewerRouter.patch('updateSequenceHeader', '/Sequences/:sequenceId', koaBody(), async (ctx, next) => {
		await Sequences.save(ctx, next);
	});

	interviewerRouter.patch('updateItem', '/items/:itemId', koaBody(), async (ctx, next) => {
		ctx.request.body.id = ctx.request.body.id || ctx.params.itemId;
		await Items.save(ctx);
		await Items.one(ctx, next);
	});

	interviewerRouter.patch('updateUse', '/Sequences/:sequenceId/steps/:stepId', koaBody(), Steps.save)
	interviewerRouter.delete('/Sequences/:sequenceId');
	interviewerRouter.delete('deleteItem', '/items/:itemId', async(ctx) => {
		// TODO: Delete item from db and clear refs
		ctx.body = ctx.params.itemId
	});
	interviewerRouter.delete('removeItem', 'Sequences/:sequenceId/:itemId', async(ctx) => {
		// TODO: remove item steps
		ctx.body = ctx.params.itemId
	});

	interviewerRouter.delete('/assets/:assetId');
})();

