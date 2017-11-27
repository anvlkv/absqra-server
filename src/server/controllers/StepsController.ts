import { createConnection, getConnection, getManager } from 'typeorm';
import { Context } from 'koa'
import { Step } from '../../entity/Step';

export class StepsController {
	constructor (
	) {
	}

	async list(ctx, next?) {
		const StepsRepository = getManager().getRepository(Step);

		ctx.body = await StepsRepository.find(ctx.request.body);

		if (next) next();
	}

	async one(ctx, next?) {
		const StepsRepository = getManager().getRepository(Step);

		ctx.body = await StepsRepository.findOne(ctx.params.stepId);

		if (next) next();
	}

	async create(ctx, next?) {
		const StepsRepository = getManager().getRepository(Step);

		const newItemUse = StepsRepository.create(ctx.request.body);
		await StepsRepository.save(newItemUse);
		ctx.body = newItemUse;

		if (next) next();
	}

	async save(ctx, next?) {
		const StepsRepository = getManager().getRepository(Step);



		ctx.body = await StepsRepository.save(ctx.request.body);

		if (next) next();
	}

}

export async function StepsControllerFactory() {

	return new StepsController()
}
