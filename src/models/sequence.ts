import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { ItemUseSchema } from './itemUse';

export const SequenceSchema = new Schema({
    name: String,
    description: String,
    sequenceMode: {type: String, enum: ['select', 'add', 'assign']},
    uses: [{type: ItemUseSchema, ref: 'ItemUse'}]
});

export const Sequence = mongoose.model('Sequence', SequenceSchema);
