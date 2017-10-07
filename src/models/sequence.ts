import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export  const ItemUseSchema = new Schema({
    useMode: {type: String, enum:['singular', 'plural']},
    modifiable: Boolean,
    assetsVisibilityMode: {type: String, enum:['individual', 'collaborative']},
    item:{type: Schema.Types.ObjectId, ref: 'Item'}
});

export const SequenceSchema = new Schema({
    name: String,
    description: String,
    sequenceMode: {type: String, enum:['select', 'add', 'assign']},
    sequence: [ItemUseSchema]
});

exports.Sequence = mongoose.model('Sequence', SequenceSchema);