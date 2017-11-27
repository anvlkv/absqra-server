import { getManager } from 'typeorm';
import { Sequence } from '../../entity/Sequence';

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

		ctx.body = await SequencesRepository.findOne(ctx.params.sequenceId);

		if (next) next();
	}

	async create(ctx, next?) {
		const SequencesRepository = getManager().getRepository(Sequence);

		const newSequence = SequencesRepository.create(ctx.request.body);
		await SequencesRepository.save(newSequence);
		ctx.body = newSequence;

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
