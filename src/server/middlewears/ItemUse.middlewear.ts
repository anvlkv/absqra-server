
import { ItemUse } from '../../models/itemUse';


export class ItemUseMiddlewear {

	async list(ctx, next?) {
		ctx.body = await ItemUse.find().exec();

		if (next) next();
	}

	async create(ctx, next?) {
		ctx.body = await new ItemUse(ctx.request.body).save();

		if (next) next();
	}

	async one(ctx, next?) {
		ctx.body = await  ItemUse.findById(ctx.params.sequenceId).exec();

		if (next) next();
	}

	async update(ctx, next?) {
		const useToUpdate = await ItemUse.findById(ctx.params.sequenceId);

		// ctx.body = await (<any>sequenceToUpdate).patch(ctx.request.body);

		if (next) next();
	}
}
