import { getConnection, getManager } from 'typeorm';
import { Asset } from '../../entity/Asset';

export class AssetsController {
	constructor (
	) {
	}

	async list(ctx, next?) {
		const AssetsRepository = getManager().getRepository(Asset);

		ctx.body = await AssetsRepository.find(ctx.request.body);

		if (next) next();
	}

	async one(ctx, next?) {
		const AssetsRepository = getManager().getRepository(Asset);

		ctx.body = await AssetsRepository.findOne(ctx.params.assetId);
		if (next) next();
	}

	async create(ctx, next?) {
		const AssetsRepository = getManager().getRepository(Asset);

		const newAsset = AssetsRepository.create(ctx.request.body);
		await AssetsRepository.save(newAsset);
		ctx.body = newAsset;

		if (next) next();
	}

	async save(ctx, next?) {
		const AssetsRepository = getManager().getRepository(Asset);



		ctx.body = await AssetsRepository.save(ctx.request.body);

		if (next) next();
	}
}

export async function AssetControllerFactory() {

	return new AssetsController()
}
