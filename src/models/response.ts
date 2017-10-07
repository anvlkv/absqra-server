import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ItemResponseSchema = new Schema({
    item:{type: Schema.Types.ObjectId, ref: 'Item'},
    sequence:{type: Schema.Types.ObjectId, ref: 'Sequence'},
});

export const ResponseSchema = new Schema({
    respondent: String,
    sequence: {type: Schema.Types.ObjectId, ref: 'Sequence'},
    response: [ItemResponseSchema]
});

exports.Response = mongoose.model('Response', ResponseSchema);

