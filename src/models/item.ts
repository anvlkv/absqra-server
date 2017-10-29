import * as mongoose from 'mongoose';
import { AssetSchema } from './asset';
const Schema = mongoose.Schema;


export const ItemSchema = new Schema({
    name: String,
    description: String,
    question: {type: AssetSchema, ref: 'Asset'},
    itemType: {type: String, enum: ['display', 'select', 'add', 'assign', 'complete']},
    itemMode: {type: String, enum: ['single', 'multiple']},
    assets: [{type: AssetSchema, ref: 'Asset'}]
});


export const Item = mongoose.model('Item', ItemSchema);
