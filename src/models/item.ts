import { InstanceType, plugin, prop, Typegoose } from 'typegoose';
import { Asset } from './asset';
import { Model } from 'mongoose';
import * as patcher from 'mongoose-json-patch';


export enum ItemTypes {
	DISPLAY = 'display',
	SELECT = 'select',
	ADD = 'add',
	ASSIGN = 'assign',
	COMPLETE = 'complete'
}

export enum ItemModes {
	SINGLE = 'single',
	MULTIPLE = 'multiple'
}

@plugin(patcher)
export class Item extends Typegoose {
	@prop()
	name: string;

	@prop()
	description: string;

	@prop({ref: Asset})
	question: Asset;

	@prop({enum: ItemTypes})
	itemType: ItemTypes;

	@prop({enum: ItemModes})
	itemMode: ItemModes;

}

export const ItemModel: Model<InstanceType<Item>> = new Item().getModelForClass(Item);
