import { Sequence, SequenceModel } from '../../models/sequence';
import { Document, DocumentQuery, Model } from 'mongoose';
import { ItemsService } from './itemsService';
import { Patch } from 'json-patch';


export class SequenceService {
	private itemsService: ItemsService;

	constructor(
	) {
		this.itemsService = new ItemsService();
	}

	sequencesList(): DocumentQuery<Document[], Document> {
		return SequenceModel.find();
	}

	createSequence(data): Promise<Document> {
		// const newSeq = new this.sequenceModel(data);

		// this.dataService.connection.collection('sequences').insertOne(newSeq);
		return new SequenceModel(data).save();
	}

	getSequence(_id): Promise<Document> {
		return SequenceModel.findOne({_id}).populate({path: 'uses', populate: {path: 'item'}}).exec();
	}

	updateSequence(_id, updateDoc): Promise<Document> {
		return SequenceModel.findByIdAndUpdate(_id, updateDoc).exec()
	}

	addItemUse(_id, useDoc): Promise<Document> {
		return this.updateSequence(_id, {$push: {uses: useDoc}})
	}

	updateItemUse(_id, useIndex, useDoc): Promise<Document> {
		const $set = {};
		$set[`uses.${useIndex}`] = useDoc;
		return this.updateSequence(_id, {$set})
	}

	applyPatch(_id, patch: Patch) {
		return (<any>SequenceModel).findById(_id).patch(patch);
	}
}

