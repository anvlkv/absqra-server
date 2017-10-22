import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const AssetSchema = new Schema({
    assetType: {type: String, enum: ['static', 'dynamic']},
    contentType: {type: String, enum: ['text', 'file', 'remote', 'internal:sequence', 'internal:item']},
    source: {type: Schema.Types.ObjectId, ref: 'Item'},
    content: String
});

exports.Asset = mongoose.model('Asset', AssetSchema);