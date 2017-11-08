import { createConnection, getConnection, getManager } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { Context } from 'koa';

export class SequencesController {
	constructor (
	) {
	}

	async list(ctx, next?) {
		const SequencesRepository = getManager().getRepository(Sequence);

		ctx.body = await SequencesRepository.find(ctx.request.body);

		if (next) next();
	}

	async one(ctx, next?) {
		const SequencesRepository = getManager().getRepository(Sequence);

		ctx.body = await SequencesRepository.findOneById(ctx.params.sequenceId);

		if (next) next();
	}

	async create(ctx, next?) {
		const SequencesRepository = getManager().getRepository(Sequence);

		const newSequence = SequencesRepository.create(ctx.request.body);
		await SequencesRepository.save(newSequence);
		ctx.body = newSequence;

		if (next) next();
	}

	async update(ctx, next?) {
		await getConnection()
		.createQueryBuilder()
		.update(Sequence)
		.set(ctx.request.body)
		.where('id = :id', { id: ctx.params.sequenceId })
		.execute();

		ctx.body = await this.one(ctx);

		if (next) next();
	}

	async save(ctx, next?) {
		const SequencesRepository = getManager().getRepository(Sequence);



		ctx.body = await SequencesRepository.save(ctx.request.body);

		if (next) next();
	}
}

export async function SequenceControllerFactory() {

	return new SequencesController()
}
