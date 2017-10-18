import * as patcher from 'mongoose-json-patch';
import { arrayProp, InstanceType, plugin, prop, Ref, Typegoose } from 'typegoose';
import { Item } from './item';
import { Model } from 'mongoose';

export enum UseModes {
	SINGULAR = 'singular',
	PLURAL = 'plural'
}

export enum VisibilityModes {
	INDIVIDUAL = 'individual',
	COLLABORATIVE = 'collaborative'
}

export enum SequenceModes {
	SELECT = 'select',
	ADD = 'add',
	ASSIGN = 'assign'
}

export class ItemUse {
	@prop({enum: UseModes})
	useMode?: UseModes;

	@prop()
	modifiable: boolean;

	@prop({enum: VisibilityModes, default: VisibilityModes.INDIVIDUAL})
	assetsVisibilityMode: VisibilityModes;

	@prop({ref: Item})
	item: Ref<Item>;
}


@plugin(patcher)
export class Sequence extends Typegoose {
	@prop()
	name: string;

	@prop()
	description?: string;

	@prop({enum: SequenceModes})
	sequenceMode: SequenceModes;

	@arrayProp({items: ItemUse})
	uses: ItemUse[];
}

export const SequenceModel: Model<InstanceType<Sequence>> = new Sequence().getModelForClass(Sequence);
