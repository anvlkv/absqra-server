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

		ctx.body = await ItemsRepository.findOne(ctx.params.itemId);

		if (next) next();
	}

	async create(ctx, next?) {
		const ItemsRepository = getManager().getRepository(Item);

		const newItem = ItemsRepository.create(ctx.request.body);
		await ItemsRepository.save(newItem);
		ctx.body = newItem;

		if (next) next();
	}

	async save(ctx, next?) {
		const ItemsRepository = getManager().getRepository(Item);

		if (ctx.request.body.id) {
			await ItemsRepository.update(ctx.request.body.id, ctx.request.body);
		}
		else {
			await ItemsRepository.save(ctx.request.body);
		}

		if (next) next();
	}
}

export async function ItemControllerFactory() {

	return new ItemsController()
}
