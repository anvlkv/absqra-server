

import { getConnection, getRepository } from 'typeorm';
import { Sequence} from '../entity/Sequence';
import { AssetContentTypes, AssetTypes } from '../entity/Asset';
import { Step, StepTypes } from '../entity/Step';
import { ItemLifeCycleTypes, QuantityOrder } from '../entity/Item';
import { TYPE_ValidationTypes, ValidationTypes } from '../entity/FormatConstraint';


export function fixture() {
	return async function () {
		const repo = await getConnection().getRepository(Sequence);
		const count = await repo.count();
		if (count === 0) {
			console.time('Fixed you a fixture');

			const Seq = new Sequence();

			Seq.name = 'Fixture sequence';
			Seq.description = 'Fixture description';

			Seq.steps = [{
				type: StepTypes.ITEM_REF,
				order: 0,
				isItemOrigin: true,
				item: {
					question: {
						assetType: AssetTypes.STATIC,
						contentType: AssetContentTypes.TEXT,
						content: 'Fixture asset'
					},
					name: 'Fixture item',
					description: 'Fixture description ',
					offers: QuantityOrder.MULTIPLE,
					expects: QuantityOrder.ONE,
					assets: [
						{
							assetType: AssetTypes.STATIC,
							contentType: AssetContentTypes.TEXT,
							content: 'blah blah'
						},
						// {
						// 	assetType: AssetTypes.STATIC,
						// 	contentType: AssetContentTypes.SUBSET,
						// 	// subset: [
						// 	// 	{
						// 	// 		assetType: AssetTypes.STATIC,
						// 	// 		contentType: AssetContentTypes.TEXT,
						// 	// 		content: 'blah blah 2'
						// 	// 	},
						// 	// 	{
						// 	// 		assetType: AssetTypes.STATIC,
						// 	// 		contentType: AssetContentTypes.TEXT,
						// 	// 		content: 'blah blah 3'
						// 	// 	},
						// 	// ]
						// }
					],
					formatConstraints: [
						{
							validationType: ValidationTypes.TYPE,
							validationSubType: TYPE_ValidationTypes.IS_TEXT,
							booleanConstraint: true
						}
					],
					lifeCycle: ItemLifeCycleTypes.ONE_ONE
				},

			}]

			await repo.save(Seq).catch(e => {
				console.error('Your model gone wild...', e);
			});

			console.timeEnd('Fixed you a fixture')
		}
	}
}
