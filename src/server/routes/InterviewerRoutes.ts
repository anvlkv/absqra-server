import * as Router from 'koa-router';

import {InterviewsService} from '../../services/interviewsService';

const interviewerRouter = new Router();

const interviews: InterviewsService = new InterviewsService();


interviewerRouter.get('/sequences', interviews.sequencesList);
interviewerRouter.get('/sequences/:sequenceId');
interviewerRouter.get('/items');
interviewerRouter.get('/items/:itemId');
interviewerRouter.get('/assets/:assetId');
interviewerRouter.get('/responses/:responseId');
interviewerRouter.get('/responses/:responseId/:itemId');
interviewerRouter.get('/responses/:sequenceId/:respondentId');
interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

interviewerRouter.post('/sequences');
interviewerRouter.post('/items');
interviewerRouter.post('/responses');
interviewerRouter.post('/responses/:responseId/:itemId');
interviewerRouter.post('/assets');

interviewerRouter.patch('/sequences/:sequenceId');
interviewerRouter.patch('/items/:itemId');

interviewerRouter.delete('/sequences/:sequenceId');
interviewerRouter.delete('/items/:itemId');
interviewerRouter.delete('/assets/:assetId');

export default interviewerRouter;