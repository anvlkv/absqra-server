import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;


const ItemSchema = new Schema({
    name: String,
    description: String,
    question: {type: Schema.Types.ObjectId, ref: 'Asset'},
    itemType: {type: String, enum: ['display','select', 'add', 'assign', 'complete']},
    itemMode: {type: String, enum: ['single', 'multiple']},
    assets: [{type: Schema.Types.ObjectId, ref: 'Asset'}]
});

exports.Item = mongoose.model('Item', ItemSchema);