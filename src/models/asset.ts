import { InstanceType, prop, Typegoose } from 'typegoose';
import { Model } from 'mongoose';

export enum AssetTypes {
	STATIC = 'static',
	DYNAMIC = 'dynamic'
}

export enum ContentTypes {
	TEXT = 'text',
	FILE = 'file',
	REMOTE = 'remote',
	REF_SEQUENCE = 'ref:sequence',
	REF_ITEM = 'ref:item'
}

export class Asset extends Typegoose {

	@prop({enum: AssetTypes})
	assetType: AssetTypes;

	@prop({enum: ContentTypes})
	contentType: ContentTypes;

	@prop()
	content?: string;
}

export const AssetsModel: Model<InstanceType<Asset>> = new Asset().getModelForClass(Asset);
