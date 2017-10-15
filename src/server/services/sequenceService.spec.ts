// import { DataService, dataService } from './dataService';
// import { SequenceSchema } from '../models/sequence';
// import { Document, DocumentQuery, Model } from 'mongoose';
// import { ItemsService } from './itemsService';
// import { Patch } from 'json-patch';
//
//
// export class SequenceService {
//     private dataService:DataService;
//     private itemsService:ItemsService;
//     private sequenceModel: Model<any>;
//
//     constructor(
//     ){
// 	    this.dataService = dataService;
// 	    this.itemsService = new ItemsService();
// 	    this.sequenceModel = this.dataService.connection.model('Sequence', SequenceSchema);
//     }
//
//     sequencesList(): DocumentQuery<Document[], Document>{
//         return this.sequenceModel.find();
//     }
//
//     createSequence(data): Promise<Document>{
// 	    const newSeq = new this.sequenceModel(data);
//
// 	    // this.dataService.connection.collection('sequences').insertOne(newSeq);
//         return newSeq.save();
//     }
//
//     getSequence(_id): Promise<Document> {
//         return this.sequenceModel.findOne({_id}).populate({path:'uses', populate:{path:'item'}}).exec();
//     }
//
//     updateSequence(_id, updateDoc): Promise<Document>{
//     	return this.sequenceModel.findByIdAndUpdate(_id, updateDoc).exec()
//     }
//
//     addItemUse(_id, useDoc): Promise<Document>{
//     	return this.updateSequence(_id, {$push:{uses: useDoc}})
//     }
//
//     updateItemUse(_id, useIndex, useDoc): Promise<Document>{
//     	const $set = {};
//     	$set[`uses.${useIndex}`] = useDoc;
//     	return this.updateSequence(_id, {$set})
//     }
//
//     applyPatch(_id, patch: Patch){
//     	return (<any>this.sequenceModel).findById(_id).patch(patch);
//     }
// }
//
// //{"_id":"59da053e9744f83a397fb60e","name":"my new sequence","description":"some description text","sequence":[{"_id":"59da053e9744f83a397fb610"},{"_id":"59da053e9744f83a397fb60f"}]}

import { SequenceService } from './sequenceService';


describe('SequenceService', ()=>{
	// it('should be created', inject([SequenceService], (service: SequenceService) => {
	// 	expect(service).toBeTruthy();
	// }));

	it('should apply JSON patch documents', ()=>{

	})
})