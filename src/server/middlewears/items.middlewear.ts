// import { DataService, dataService } from './mdbConnection.middlewear';
// import { Model, Document, Types } from 'mongoose';
// import { ItemSchema } from '../../models/item';
// import { Patch } from 'json-patch';
// import ObjectId = Types.ObjectId;
//
//
//
//
// export class ItemsService {
//     private dataService: DataService;
//     private itemModel: Model<any>;
//
//     constructor(
//     ) {
//         this.dataService = dataService;
//         this.itemModel = this.dataService.connection.model('Item', ItemSchema);
//     }
//
//     itemsList(): Promise<Document[]> {
//         return this.itemModel.find().exec()
//     }
//
//     createItem(data) {
// 	    // const newItem = ;
// 	    // this.dataService.connection.collection('items').insertOne(newItem)
// 	    return (new this.itemModel(data)).save();
//     }
//
//     getItem(_id) {
//         return this.itemModel.findOne({_id: ObjectId(_id)}).populate('assets').exec();
//     }
//
// 	applyPatch(_id, patch: Patch) {
// 		return (<any>this.itemModel).findById(_id).patch(patch);
// 	}
//
// }

import { Item } from '../../models/item';


export class ItemsMiddlewear {
	constructor() {}

	async list(ctx, next?) {
		ctx.body = await Item.find().exec();

		if (next) next();
	}

	async create(ctx, next?) {
		ctx.body = await new Item(ctx.request.body).save();

		if (next) next();
	}

	async one(ctx, next?) {
		ctx.body = await Item.findById(ctx.params.itemId).exec();

		if (next) next();
	}

	async update(ctx, next?) {
		ctx.body = await Item.findByIdAndUpdate(ctx.params.itemId, ctx.request.body).exec();
		
		if (next) next();
	}
}
