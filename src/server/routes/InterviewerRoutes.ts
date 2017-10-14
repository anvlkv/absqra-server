import * as Router from 'koa-router';
import {SequenceService} from '../../services/sequenceService';
import * as koaBody from 'koa-body';
import { ItemsService } from '../../services/itemsService';
import { AssetsService } from '../../services/assetsService';

const interviewerRouter = new Router();

const sequenceService: SequenceService = new SequenceService();
const itemsService: ItemsService = new ItemsService();
const assetsService: AssetsService = new AssetsService();

interviewerRouter.get('getSequences','/sequences', async (ctx)=> {
	ctx.body = await sequenceService.sequencesList();
});
interviewerRouter.get('getSequence','/sequences/:sequenceId', async (ctx)=>{
	ctx.body = await sequenceService.getSequence(ctx.params.sequenceId);
});

interviewerRouter.get('getItems','/items', async(ctx)=>{
	ctx.body = await itemsService.itemsList();
});
interviewerRouter.get('getItem','/items/:itemId', async(ctx)=>{
	ctx.body = await itemsService.getItem(ctx.params.itemId);
});

interviewerRouter.get('getAssets','/assets', async(ctx)=>{
	ctx.body = await assetsService.assetsList();
});
interviewerRouter.get('getAsset','/assets/:assetId', async(ctx)=>{
	ctx.body = await assetsService.getAssetById(ctx.params.assetId);
});

interviewerRouter.get('/responses/:responseId');
interviewerRouter.get('/responses/:responseId/:itemId');
interviewerRouter.get('/responses/:sequenceId/:respondentId');
interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

interviewerRouter.post('addSequence','/sequences', koaBody(), async (ctx)=> {
	ctx.body = await sequenceService.createSequence(ctx.request.body);
});
interviewerRouter.post('addItem','/items', koaBody(), async (ctx)=>{
	ctx.body = await itemsService.createItem(ctx.request.body);
});

interviewerRouter.post('/responses');
interviewerRouter.post('/responses/:responseId/:itemId');
interviewerRouter.post('addAsset','/assets', koaBody(), async(ctx)=>{
	ctx.body = await assetsService.createAsset(ctx.request.body);
});

interviewerRouter.patch('/sequences/:sequenceId');
interviewerRouter.patch('/items/:itemId');

interviewerRouter.delete('/sequences/:sequenceId');
interviewerRouter.delete('/items/:itemId');
interviewerRouter.delete('/assets/:assetId');

export default interviewerRouter;