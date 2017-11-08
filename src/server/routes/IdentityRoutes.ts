import * as Router from 'koa-router';

export const identitiesRouter = new Router();

identitiesRouter.get('/users');
identitiesRouter.get('/users/:userId');
identitiesRouter.get('/respondents');
identitiesRouter.get('/respondents/:respondentId');

identitiesRouter.post('/users');
identitiesRouter.post('/respondents');
identitiesRouter.post('/users/credentials');
identitiesRouter.post('/respondents/credentials');

identitiesRouter.patch('/users/:userId');
identitiesRouter.patch('/respondents/:respondentId');

identitiesRouter.delete('/users/:userId');
identitiesRouter.delete('/respondents/:respondentId');
