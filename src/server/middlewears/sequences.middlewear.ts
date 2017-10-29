// import { DataService, dataService } from './mdbConnection.middlewear';
// import { SequenceSchema } from '../../models/sequence';
// import { Document, DocumentQuery, Model } from 'mongoose';
// import { ItemsService } from './itemsService';
// import { Patch } from 'json-patch';
//
//
// export class SequenceService {
//     private dataService: DataService;
//     private itemsService: ItemsService;
//     private sequenceModel: Model<any>;
//
//     constructor(
//     ) {
// 	    this.dataService = dataService;
// 	    this.itemsService = new ItemsService();
// 	    this.sequenceModel = this.dataService.connection.model('Sequence', SequenceSchema);
//     }
//
//     sequencesList(): Promise<Document[]> {
//         return this.sequenceModel.find().exec();
//     }
//
//     createSequence(data): Promise<Document> {
// 	    const newSeq = new this.sequenceModel(data);
//
// 	    // this.dataService.connection.collection('sequences').insertOne(newSeq);
//         return newSeq.save();
//     }
//
//     getSequence(_id): Promise<Document> {
//         return this.sequenceModel.findOne({_id}).populate({path: 'uses', populate: {path: 'item'}}).exec();
//     }
//
//     updateSequence(_id, updateDoc): Promise<Document> {
//     	return this.sequenceModel.findByIdAndUpdate(_id, updateDoc).exec()
//     }
//
//     addItemUse(_id, useDoc): Promise<Document> {
//     	return this.updateSequence(_id, {$push: {uses: useDoc}})
//     }
//
//     updateItemUse(_id, useIndex, useDoc): Promise<Document> {
//     	const $set = {};
//     	$set[`uses.${useIndex}`] = useDoc;
//     	return this.updateSequence(_id, {$set})
//     }
//
//     applyPatch(_id, patch: Patch) {
//     	return (<any>this.sequenceModel).findById(_id).patch(patch);
//     }
// }
import { Sequence } from '../../models/sequence';


export class SequencesMiddlewear {

	async list(ctx, next?) {
		ctx.body = await Sequence.find().exec();

		if (next) next();
	}

	async create(ctx, next?) {
		ctx.body = await new Sequence(ctx.request.body).save();

		if (next) next();
	}

	async one(ctx, next?) {
		ctx.body = await  Sequence.findById(ctx.params.sequenceId).exec();

		if (next) next();
	}

	async update(ctx, next?) {
		ctx.body = await Sequence.findByIdAndUpdate(ctx.params.sequenceId, ctx.request.body, {new: true}).exec();
		console.log(ctx.body);
		if (next) next();
	}
}
