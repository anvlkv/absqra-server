import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { SequencesMiddlewear } from '../middlewears/sequences.middlewear';
import { ItemsMiddlewear } from '../middlewears/items.middlewear';
import { ItemUseMiddlewear } from '../middlewears/ItemUse.middlewear';
import { AssetsMiddlewear } from '../middlewears/assets.middlewear';

const interviewerRouter = new Router();
const sequences = new SequencesMiddlewear();
const uses = new ItemUseMiddlewear();
const items = new ItemsMiddlewear();
const assets = new AssetsMiddlewear();

interviewerRouter.get('getSequences', '/sequences', sequences.list);
interviewerRouter.get('getSequence', '/sequences/:sequenceId', sequences.one);

interviewerRouter.get('getItems', '/items', items.list);
interviewerRouter.get('getItem', '/items/:itemId', items.one);

interviewerRouter.get('getAssets', '/assets', assets.list);
interviewerRouter.get('getAsset', '/assets/:assetId', assets.one);

// interviewerRouter.get('/responses/:responseId');
// interviewerRouter.get('/responses/:responseId/:itemId');
// interviewerRouter.get('/responses/:sequenceId/:respondentId');
// interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

interviewerRouter.post('addSequence', '/sequences', koaBody(), sequences.create);

interviewerRouter.post('addNewItemToSequence', '/sequences/:sequenceId', koaBody(), async (ctx, next) => {
	await items.create(ctx);
	ctx.request.body = {
		item: await ctx.body,
		isItemOrigin: true
	};

	await uses.create(ctx);
	ctx.request.body = {$push: {uses: ctx.body}};


	await sequences.update(ctx);
	next();
});

interviewerRouter.post('/responses');
interviewerRouter.post('/responses/:responseId/:itemId');
interviewerRouter.post('addAsset', '/assets', koaBody(), assets.create);

interviewerRouter.patch('updateSequence', '/sequences/:sequenceId', koaBody(), async (ctx) => {
	// ctx.body = await sequenceService.applyPatch(ctx.params.sequenceId, ctx.request.body)
});

interviewerRouter.patch('updateItem', '/items/:itemId', koaBody(), items.update);

interviewerRouter.patch('updateUse', '/sequences/:sequenceId/uses/:useIndex', koaBody(), async (ctx) => {
	// ctx.body = await itemsService.applyPatch(ctx.params.itemID, ctx.request.body)
});

interviewerRouter.delete('/sequences/:sequenceId');
interviewerRouter.delete('deleteItem', '/items/:itemId', async(ctx) => {
	// TODO: Delete item from db and clear refs
	ctx.body = ctx.params.itemId
});
interviewerRouter.delete('removeItem', 'sequences/:sequenceId/:itemId', async(ctx) => {
	// TODO: remove item use
	ctx.body = ctx.params.itemId
});

interviewerRouter.delete('/assets/:assetId');

export default interviewerRouter;
