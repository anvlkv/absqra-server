import { DataService, dataService } from './dataService';
import { SequenceSchema } from '../models/sequence';
import { Document, DocumentQuery, Model } from 'mongoose';
import { ItemsService } from './itemsService';


export class SequenceService {
    private dataService:DataService;
    private itemsService:ItemsService;
    private sequenceModel: Model<any>;
    constructor(
    ){
	    this.dataService = dataService;
	    this.itemsService = new ItemsService();
	    this.sequenceModel = this.dataService.connection.model('Sequence', SequenceSchema);
    }

    sequencesList(): DocumentQuery<Document[], Document>{
        return this.sequenceModel.find();
    }

    createSequence(data): Promise<Document>{
	    const newSeq = new this.sequenceModel(data);

	    // this.dataService.connection.collection('sequences').insertOne(newSeq);
        return newSeq.save();
    }

    getSequence(_id): Promise<Document> {
        return this.sequenceModel.findOne({_id}).populate({path:'uses', populate:{path:'item'}}).exec();
    }
}

//{"_id":"59da053e9744f83a397fb60e","name":"my new sequence","description":"some description text","sequence":[{"_id":"59da053e9744f83a397fb610"},{"_id":"59da053e9744f83a397fb60f"}]}