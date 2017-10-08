import { DataService, dataService } from './dataService';
import { AssetSchema } from '../models/asset';
import { Model } from 'mongoose';


export class AssetsService{
	private dataService: DataService;
	private assetsModel: Model<any>;

	constructor(){
		this.dataService = dataService;
		this.assetsModel = this.dataService.connection.model('Asset', AssetSchema);
	}
	
	assetsList(){
		return this.assetsModel.find().exec();
	}

	getAssetById(_id){
		return this.assetsModel.findOne({_id}).exec();
	}

	createAsset(data){
		const newAsset = new this.assetsModel(data);

		return newAsset.save();
	}
}