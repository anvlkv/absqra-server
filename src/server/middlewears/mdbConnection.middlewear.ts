import * as mongoose from 'koa-mongoose';

console.time('Connected to MongoDB instance');

export const mdbConnection = mongoose({
	user: 'intervey-api',
	pass: 'another**Pa55w0rd!',
	host: 'ds163034.mlab.com',
	port: 63034,
	database: 'intervey-dev',
	mongodbOptions: {
		poolSize: 5,
		native_parser: true,
		useMongoClient: true,
	},
	events: {
		connected() {
			console.timeEnd('Connected to MongoDB instance');
		}
	}
});
