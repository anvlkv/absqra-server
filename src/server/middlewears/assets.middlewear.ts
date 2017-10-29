// import { DataService, dataService } from './mdbConnection.middlewear';
// import { AssetSchema } from '../../models/asset';
// import { Model } from 'mongoose';
//
//
// export class AssetsService {
// 	private dataService: DataService;
// 	private assetsModel: Model<any>;
//
// 	constructor() {
// 		this.dataService = dataService;
// 		this.assetsModel = this.dataService.connection.model('Asset', AssetSchema);
// 	}
//
// 	assetsList() {
// 		return this.assetsModel.find().exec();
// 	}
//
// 	getAssetById(_id) {
// 		return this.assetsModel.findOne({_id}).exec();
// 	}
//
// 	createAsset(data) {
// 		const newAsset = new this.assetsModel(data);
//
// 		return newAsset.save();
// 	}
// }
import { Asset } from '../../models/asset';


export class AssetsMiddlewear {
	constructor() {}

	async list(ctx, next) {
		ctx.body = await Asset.find().exec()

		if (next) next();
	}

	async one(ctx, next) {
		ctx.body = await Asset.findById(ctx.params.assetId).exec();

		if (next) next();
	}

	async create(ctx, next) {
		ctx.body = await new Asset(ctx.request.body).save();

		if (next) next();
	}
}
