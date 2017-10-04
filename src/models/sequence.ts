
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ItemUseSchema = new Schema({
    useMode: {type: String, enum:['singular', 'plural']},
    modifiable: Boolean,
    assetsVisibilityMode: {type: String, enum:['individual', 'collaborative']},
    item:{type: Schema.Types.ObjectId, ref: 'Item'}
})

const SequenceSchema = new Schema({
    name: String,
    description: String,
    sequenceMode: {type: String, enum:['select', 'add', 'assign']},
    itemsUses: [ItemUseSchema]
});

exports.Sequence = mongoose.model('Sequence', SequenceSchema);