import * as Router from 'koa-router';

const identitiesRouter = new Router();

identitiesRouter.get('users');
identitiesRouter.get('users/:userId');
identitiesRouter.get('respondents');
identitiesRouter.get('respondents/:respondentId');

identitiesRouter.post('users');
identitiesRouter.post('respondents');

identitiesRouter.patch('users/:userId');
identitiesRouter.patch('respondents/:respondentId');

identitiesRouter.delete('users/:userId');
identitiesRouter.delete('respondents/:respondentId');

// identitiesRouter.get('items/:itemId');
// identitiesRouter.get('assets/:assetId');
// identitiesRouter.get('responses/:responseId');
// identitiesRouter.get('responses/:responseId/:itemId');
// identitiesRouter.get('responses/:sequenceId/:respondentId');
// identitiesRouter.get('responses/:sequenceId/:itemId/:respondentId');
//
// identitiesRouter.post('sequences');
// identitiesRouter.post('items');
// identitiesRouter.post('responses');
// identitiesRouter.post('responses/:responseId/:itemId');
// identitiesRouter.post('assets');
//
// identitiesRouter.patch('sequences/:sequenceId');
// identitiesRouter.patch('items/:itemId');
//
// identitiesRouter.delete('sequences/:sequenceId');
// identitiesRouter.delete('items/:itemId');
// identitiesRouter.delete('assets/:assetId');

export default identitiesRouter;