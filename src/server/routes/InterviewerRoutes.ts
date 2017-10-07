import * as Router from 'koa-router';
import {SequenceService} from '../../services/sequenceService';
import * as koaBody from 'koa-body';
import { ItemsService } from '../../services/itemsService';

const interviewerRouter = new Router();

const sequenceService: SequenceService = new SequenceService();
const itemsService: ItemsService= new ItemsService();


interviewerRouter.get('/sequences', async (ctx)=> {
	ctx.body = await sequenceService.sequencesList();
});
interviewerRouter.get('/sequences/:sequenceId');
interviewerRouter.get('/items', async(ctx)=>{

	ctx.body= await itemsService.itemsList();
});
interviewerRouter.get('/items/:itemId');
interviewerRouter.get('/assets/:assetId');
interviewerRouter.get('/responses/:responseId');
interviewerRouter.get('/responses/:responseId/:itemId');
interviewerRouter.get('/responses/:sequenceId/:respondentId');
interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

interviewerRouter.post('/sequences', koaBody(), async (ctx)=> {
	ctx.body = await sequenceService.createSequence(ctx.request);
});
interviewerRouter.post('/items', );
interviewerRouter.post('/responses');
interviewerRouter.post('/responses/:responseId/:itemId');
interviewerRouter.post('/assets');

interviewerRouter.patch('/sequences/:sequenceId');
interviewerRouter.patch('/items/:itemId');

interviewerRouter.delete('/sequences/:sequenceId');
interviewerRouter.delete('/items/:itemId');
interviewerRouter.delete('/assets/:assetId');

export default interviewerRouter;