import { Asset, AssetsModel } from '../../models/asset';
import { InstanceType } from 'typegoose';


export class AssetsService {

	constructor() {
	}

	assetsList(): Promise<InstanceType<Asset>[]> {
		return AssetsModel.find().exec();
	}

	getAssetById(_id): Promise<InstanceType<Asset>> {
		return AssetsModel.findOne({_id}).exec();
	}

	createAsset(data) {
		return new AssetsModel(data).save();
	}
}