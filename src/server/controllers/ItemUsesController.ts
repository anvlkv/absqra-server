import { createConnection, getConnection, getManager } from 'typeorm';
import { Context } from 'koa'
import { ItemUse } from '../../entity/ItemUse';

export class ItemUsesController {
	constructor (
	) {
	}

	async list(ctx, next?) {
		const ItemUsesRepository = getManager().getRepository(ItemUse);

		ctx.body = await ItemUsesRepository.find(ctx.request.body);

		if (next) next();
	}

	async one(ctx, next?) {
		const ItemUsesRepository = getManager().getRepository(ItemUse);

		ctx.body = await ItemUsesRepository.findOneById(ctx.params.sequenceId);

		if (next) next();
	}

	async create(ctx, next?) {
		const ItemUsesRepository = getManager().getRepository(ItemUse);

		const newItemUse = ItemUsesRepository.create(ctx.request.body);
		await ItemUsesRepository.save(newItemUse);
		ctx.body = newItemUse;

		if (next) next();
	}

	async update(ctx, next?) {
		await getConnection()
		.createQueryBuilder()
		.update(ItemUse)
		.set(ctx.request.body)
		.where('id = :id', { _id: ctx.params.itemId })
		.execute();

		ctx.body = await this.one(ctx);

		if (next) next();
	}
}

export async function ItemUseControllerFactory() {

	return new ItemUsesController()
}
