import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { Step } from '../../entity/Step';
import { Asset } from '../../entity/Asset';
import { FormatConstraint } from '../../entity/FormatConstraint';
import { getConnection } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { Item } from '../../entity/Item';


export const interviewerRouter = new Router();


// (async () => {

	// const Constraints = getConnection().getRepository(FormatConstraint);


	interviewerRouter.get('getSequences', '/Sequences', async (ctx, next) => {
		const Sequences = getConnection().getRepository(Sequence);

		ctx.body = await Sequences.find();
	});
	interviewerRouter.get('getSequence', '/Sequences/:sequenceId', async (ctx, next) => {
		const Sequences = getConnection().getRepository(Sequence);

		ctx.body = await Sequences.findOne(ctx.params.sequenceId);
	});

	interviewerRouter.get('getItems', '/items', async (ctx, next) => {
		const Items =  getConnection().getRepository(Item);

		ctx.body = await Items.find();
	});
	interviewerRouter.get('getItem', '/items/:itemId', async (ctx, next) => {
		const Items =  getConnection().getRepository(Item);

		ctx.body = await Items.findOne(ctx.params.itemId);
	});

	interviewerRouter.get('getAssets', '/assets', async (ctx, next) => {
		const Assets = getConnection().getRepository(Asset);

		ctx.body = await Assets.find();
	});
	interviewerRouter.get('getAsset', '/assets/:assetId', async (ctx, next) => {
		const Assets = getConnection().getRepository(Asset);

		ctx.body = await Assets.findOne(ctx.params.assetId);
	});

	interviewerRouter.get('getStep', '/steps/:stepId', async (ctx, next) => {
		const Steps = getConnection().getRepository(Step);

		ctx.body = await Steps.findOne(ctx.params.stepId);
	});


// interviewerRouter.get('/responses/:responseId');
// interviewerRouter.get('/responses/:responseId/:itemId');
// interviewerRouter.get('/responses/:sequenceId/:respondentId');
// interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

	interviewerRouter.post('addSequence', '/Sequences', koaBody(), async (ctx, next) => {
		// ctx.body = await Assets.findOne(ctx.params.assetId);
		const Sequences = getConnection().getRepository(Sequence);

		ctx.body = await Sequences.save(ctx.request.body);
	});

	interviewerRouter.post('addNewItemToSequence', '/Sequences/:sequenceId/items', koaBody(), async (ctx, next) => {
		const Sequences = getConnection().getRepository(Sequence);
		const Steps = getConnection().getRepository(Step);

		const step = new Step();
		let sequence = await Sequences.findOne(ctx.params.sequenceId);

		step.item = ctx.request.body;
		step.item.question = new Asset();
		step.order = sequence.steps.length;

		await Steps.save(step);

		sequence = {
			...sequence,
			steps: [...sequence.steps, step]
		};

		await Sequences.save(sequence);

		ctx.body = await Steps.findOne(step.id);
	});

	// interviewerRouter.post('/responses');
	// interviewerRouter.post('/responses/:responseId/:itemId');

	interviewerRouter.post('addAssetToItem', '/items/:itemId/assets', koaBody(), async (ctx, next) => {
		const Items =  getConnection().getRepository(Item);
		const item = await Items.findOne(ctx.params.itemId);

		// await Assets.create(ctx);
		const asset = new Asset(ctx.request.body);

		item.assets = item.assets ? [...item.assets, asset] : [asset];

		await Items.save(item);

		ctx.body = asset;
	});

	interviewerRouter.post('addConstraintToItem', '/items/:itemId/formatConstraints', koaBody(), async (ctx, next) => {
		const Items =  getConnection().getRepository(Item);

		const item = await Items.findOne(ctx.params.itemId);

		// await Assets.create(ctx);
		const constraint = new FormatConstraint(ctx.request.body);

		item.formatConstraints = item.formatConstraints ? [...item.formatConstraints, constraint] : [constraint];

		await Items.save(item);

		ctx.body = constraint;
	});

	interviewerRouter.post('addAsset', '/assets', koaBody(), async (ctx, next) => {
		const Assets = getConnection().getRepository(Asset);

		ctx.body = await Assets.save(ctx.request.body);
	});

	interviewerRouter.patch('updateSequenceHeader', '/Sequences/:sequenceId', koaBody(), async (ctx, next) => {
		const Sequences = getConnection().getRepository(Sequence);

		let sequence = await Sequences.findOne(ctx.params.sequenceId);
		// TODO: filter out non header props here
		sequence = {
			...sequence,
			...ctx.request.body
		};

		ctx.body = await Sequences.save(sequence);
	});

	interviewerRouter.patch('updateItem', '/items/:itemId', koaBody(), async (ctx, next) => {
		const Items =  getConnection().getRepository(Item);

		// ctx.request.body.id = ctx.request.body.id || ctx.params.itemId;
		let item = await Items.findOne(ctx.params.itemId)

		item = {
			...item,
			...ctx.request.body
		};

		await Items.save(item);
		ctx.body = await Items.findOne(item.id);
	});

	interviewerRouter.patch('updateStep', '/Sequences/:sequenceId/steps/:stepId', koaBody(), async (ctx, next) => {
		const Steps = getConnection().getRepository(Step);

		let step = await Steps.findOne(ctx.params.stepId);
		step = {
			...step,
			...ctx.request.body
		};

		ctx.body = await Steps.update({id: ctx.params.stepId}, step);
	});
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
// })();

