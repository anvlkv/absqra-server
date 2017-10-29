import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const AssetSchema = new Schema({
    assetType: {type: String, enum: ['static', 'dynamic']},
    contentType: {type: String, enum: ['text', 'file', 'remote', 'internal:sequence', 'internal:item']},
    source_id: {type: Schema.Types.ObjectId},
    content: String
});

export const Asset = mongoose.model('Asset', AssetSchema);
