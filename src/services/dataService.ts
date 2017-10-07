import * as mongoose from 'mongoose';


const MONGO_URI = 'mongodb://intervey-api:Passw0rd!@ds163034.mlab.com:63034/intervey-dev';

console.time('Connected to MongoDB instance');

const connection = mongoose.createConnection(MONGO_URI, {useMongoClient: true});

export default connection;

// module.exports.mdb = mdb;