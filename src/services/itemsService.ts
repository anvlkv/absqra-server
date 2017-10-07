import { DataService, dataService } from './dataService';
import { SequenceSchema } from '../models/sequence';
import { Document, DocumentQuery } from 'mongoose';
import { SequenceService } from './sequenceService';
import { ItemSchema } from '../models/item';


export class ItemsService{
    private dataService:DataService;
    private itemModel: any;

    constructor(
    ){
        this.dataService = dataService;
        this.itemModel = this.dataService.connection.model('Item', ItemSchema);
    }

    itemsList(){
        return this.itemModel.find()
    }

    // sequencesList(): DocumentQuery<Document[], Document>{
    //     return this.sequenceModel.find();
    // }
    //
    // createSequence(data): Promise<Document[]>{
    //     console.log(data.body);
    //     return new this.sequenceModel(data.body);
    // }

}