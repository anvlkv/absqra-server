import * as Router from 'koa-router';

const identitiesRouter = new Router();

identitiesRouter.get('/users');
identitiesRouter.get('/users/:userId');
identitiesRouter.get('/respondents');
identitiesRouter.get('/respondents/:respondentId');

identitiesRouter.post('/users');
identitiesRouter.post('/respondents');

identitiesRouter.patch('/users/:userId');
identitiesRouter.patch('/respondents/:respondentId');

identitiesRouter.delete('/users/:userId');
identitiesRouter.delete('/respondents/:respondentId');

export default identitiesRouter;