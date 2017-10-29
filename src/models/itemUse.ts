import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { ItemSchema } from './item';


export const ItemUseSchema = new Schema({
	useMode: {type: String, enum: ['singular', 'plural']},
	modifiable: Boolean,
	assetsVisibilityMode: {type: String, enum: ['individual', 'collaborative']},
	item: {type: ItemSchema, ref: 'Item'},
	isItemOrigin: Boolean
});

export const ItemUse = mongoose.model('ItemUse', ItemUseSchema);
