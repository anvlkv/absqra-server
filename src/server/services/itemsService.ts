import { DataService, dataService } from './dataService';
import { Model, Document } from 'mongoose';
import { ItemSchema } from '../../models/item';
import { Patch } from 'json-patch';


export class ItemsService{
    private dataService:DataService;
    private itemModel: Model<any>;

    constructor(
    ){
        this.dataService = dataService;
        this.itemModel = this.dataService.connection.model('Item', ItemSchema);
    }

    itemsList(): Promise<Document[]>{
        return this.itemModel.find().exec()
    }

    createItem(data){
	    const newItem = new this.itemModel(data);
	    // this.dataService.connection.collection('items').insertOne(newItem)
	    return newItem.save();
    }

    getItem(_id){
        return this.itemModel.findOne({_id}).populate('assets').exec();
    }

	applyPatch(_id, patch: Patch){
		return (<any>this.itemModel).findById(_id).patch(patch);
	}

}