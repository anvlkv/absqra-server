import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as patcher from 'mongoose-json-patch';
import { ItemSchema } from './item';

export const ItemUseSchema = new Schema({
    useMode: {type: String, enum: ['singular', 'plural']},
    modifiable: Boolean,
    assetsVisibilityMode: {type: String, enum: ['individual', 'collaborative']},
    item: {type: ItemSchema, ref: 'Item'},
    isItemOrigin: Boolean
});

export const SequenceSchema = new Schema({
    name: String,
    description: String,
    sequenceMode: {type: String, enum: ['select', 'add', 'assign']},
    uses: [ItemUseSchema]
});

SequenceSchema.plugin(patcher);

exports.Sequence = mongoose.model('Sequence', SequenceSchema);
