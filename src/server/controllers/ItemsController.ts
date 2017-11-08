import { createConnection, getConnection, getManager } from 'typeorm';
import { Context } from 'koa'
import { Item } from '../../entity/Item';

export class ItemsController {
	constructor (
	) {
	}

	async list(ctx, next?) {
		const ItemsRepository = getManager().getRepository(Item);

		ctx.body = await ItemsRepository.find(ctx.request.body);

		if (next) next();
	}

	async one(ctx, next?) {
		const ItemsRepository = getManager().getRepository(Item);

		ctx.body = await ItemsRepository.findOneById(ctx.params.sequenceId);

		if (next) next();
	}

	async create(ctx, next?) {
		const ItemsRepository = getManager().getRepository(Item);

		const newItem = ItemsRepository.create(ctx.request.body);
		await ItemsRepository.save(newItem);
		ctx.body = newItem;

		if (next) next();
	}

	async update(ctx, next?) {
		await getConnection()
		.createQueryBuilder()
		.update(Item)
		.set(ctx.request.body)
		.where('id = :id', { _id: ctx.params.itemId })
		.execute();

		ctx.body = await this.one(ctx);

		if (next) next();
	}
}

export async function ItemControllerFactory() {

	return new ItemsController()
}
