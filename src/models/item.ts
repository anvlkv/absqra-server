import * as mongoose from 'mongoose';
import { AssetSchema } from './asset';
import * as patcher from 'mongoose-json-patch';

const Schema = mongoose.Schema;


export const ItemSchema = new Schema({
    name: String,
    description: String,
    question: {type: AssetSchema, ref: 'Asset'},
    itemType: {type: String, enum: ['display', 'select', 'add', 'assign', 'complete']},
    itemMode: {type: String, enum: ['single', 'multiple']},
    assets: [{type: AssetSchema, ref: 'Asset'}]
});
ItemSchema.plugin(patcher);

exports.Item = mongoose.model('Item', ItemSchema);
