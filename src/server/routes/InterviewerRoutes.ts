import * as Router from 'koa-router';
import {SequenceService} from '../services/sequenceService';
import * as koaBody from 'koa-body';
import { ItemsService } from '../services/itemsService';
import { AssetsService } from '../services/assetsService';

const interviewerRouter = new Router();

const sequenceService: SequenceService = new SequenceService();
const itemsService: ItemsService = new ItemsService();
const assetsService: AssetsService = new AssetsService();

interviewerRouter.get('getSequences', '/sequences', async (ctx) => {
	ctx.body = await sequenceService.sequencesList();
});
interviewerRouter.get('getSequence', '/sequences/:sequenceId', async (ctx) => {
	ctx.body = await sequenceService.getSequence(ctx.params.sequenceId);
});

interviewerRouter.get('getItems', '/items', async (ctx) => {
	ctx.body = await itemsService.itemsList();
});
interviewerRouter.get('getItem', '/items/:itemId', async (ctx) => {
	ctx.body = await itemsService.getItem(ctx.params.itemId);
});

interviewerRouter.get('getAssets', '/assets', async (ctx) => {
	ctx.body = await assetsService.assetsList();
});
interviewerRouter.get('getAsset', '/assets/:assetId', async (ctx) => {
	ctx.body = await assetsService.getAssetById(ctx.params.assetId);
});

interviewerRouter.get('/responses/:responseId');
interviewerRouter.get('/responses/:responseId/:itemId');
interviewerRouter.get('/responses/:sequenceId/:respondentId');
interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

interviewerRouter.post('addSequence', '/sequences', koaBody(), async (ctx) => {
	ctx.body = await sequenceService.createSequence(ctx.request.body);
});

interviewerRouter.post('addNewItemToSequence', '/sequences/:sequenceId', koaBody(), async (ctx) => {
	const createdItem = await itemsService.createItem(ctx.request.body);
	ctx.body = await sequenceService.addItemUse(ctx.params.sequenceId, {
		item: createdItem._id,
		isItemOrigin: true
	});
});

interviewerRouter.post('/responses');
interviewerRouter.post('/responses/:responseId/:itemId');
interviewerRouter.post('addAsset', '/assets', koaBody(), async (ctx) => {
	ctx.body = await assetsService.createAsset(ctx.request.body);
});

interviewerRouter.patch('updateSequence', '/sequences/:sequenceId', koaBody(), async (ctx) => {
	ctx.body = await sequenceService.applyPatch(ctx.params.sequenceId, ctx.request.body)
});

interviewerRouter.patch('updateItem', '/items/:itemId', koaBody(), async (ctx) => {
	ctx.body = await itemsService.applyPatch(ctx.params.itemID, ctx.request.body)
});

interviewerRouter.patch('updateUse', '/sequences/:sequenceId/uses/:useIndex', koaBody(), async (ctx) => {
	ctx.body = await itemsService.applyPatch(ctx.params.itemID, ctx.request.body)
});

interviewerRouter.delete('/sequences/:sequenceId');
interviewerRouter.delete('deleteItem', '/items/:itemId', async (ctx) => {
	// TODO: Delete item from db and clear refs
	ctx.body = ctx.params.itemId
});
interviewerRouter.delete('removeItem', 'sequences/:sequenceId/:itemId', async (ctx) => {
	// TODO: remove item use
	ctx.body = ctx.params.itemId
});

interviewerRouter.delete('/assets/:assetId');

export default interviewerRouter;
