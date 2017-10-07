import { DataService, dataService } from './dataService';
import { SequenceSchema } from '../models/sequence';
import { Document, DocumentQuery } from 'mongoose';


export class SequenceService {
    private dataService:DataService;
    private sequenceModel: any;
    constructor(
    ){
	    this.dataService = dataService;
	    this.sequenceModel = this.dataService.connection.model('Sequence', SequenceSchema);
    }

    sequencesList(): DocumentQuery<Document[], Document>{
        return this.sequenceModel.find();
    }

    createSequence(data): Promise<Document[]>{
        return new this.sequenceModel(data.body);
    }

}