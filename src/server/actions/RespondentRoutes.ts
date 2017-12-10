import * as Router from 'koa-router';

export const respondentRouter = new Router();

respondentRouter.get('/:sequenceId');
respondentRouter.get('/:sequenceId/:itemId');

respondentRouter.post('/:sequenceId');
respondentRouter.post('/:sequenceId/:itemId');

respondentRouter.patch('/:sequenceId/:itemId');

respondentRouter.delete('/:sequenceId');

