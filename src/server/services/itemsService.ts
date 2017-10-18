import { Item, ItemModel } from '../../models/item';
import { Patch } from 'json-patch';
import { InstanceType } from 'typegoose';


export class ItemsService {
	// private itemModel: InstanceType<Item>;

	constructor(
	) {
		// this.itemModel = new ItemModel({});
	}

	itemsList(): Promise<Item[]> {
		return ItemModel.find().exec()
	}

	createItem(data): any {
		return new ItemModel(data).save();
	}

	getItem(_id): Promise<InstanceType<Item>> {
		return ItemModel.findOne({_id}).populate('assets').exec();
	}

	applyPatch(_id, patch: Patch) {
		return (<any>ItemModel).findById(_id).patch(patch);
	}

}
