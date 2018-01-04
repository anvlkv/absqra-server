

import { getConnection, getRepository } from 'typeorm';
import { Sequence} from '../entity/Sequence';
import { AssetContentTypes, AssetTypes } from '../entity/Asset';
import { Step, StepTypes } from '../entity/Step';
import { ItemLifeCycleTypes, QuantityOrder } from '../entity/Item';
import { TYPE_ValidationTypes, ValidationTypes } from '../entity/FormatConstraint';
import { SequenceResponse } from '../entity/SequenceResponse';
import { Respondent } from '../entity/Respondent';


export function fixture() {
	return async function () {
		const sequence = await getConnection().getRepository(Sequence);
		if ((await sequence.count()) === 0) {
			console.time('Fixed you a sequence');

			const Seq = new Sequence();

			Seq.header = {
				name: 'Fixture sequence',
			    description: 'Fixture description'
			};

			Seq.steps = [{
				type: StepTypes.ITEM_REF,
				order: 1,
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
							content: 'blah blah',
							order: 1
						},
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

			}, {
				type: StepTypes.ITEM_REF,
				order: 2,
				isItemOrigin: true,
				item: {
					name: 'Fixture 2',
					question: {
						assetType: AssetTypes.STATIC,
						contentType: AssetContentTypes.TEXT,
						content: 'Fixture asset 2'
					},
					offers: QuantityOrder.MULTIPLE,
					expects: QuantityOrder.ONE,
					lifeCycle: ItemLifeCycleTypes.ONE_ONE,
					assets: [
						{
							assetType: AssetTypes.DYNAMIC,
							content: '1',
							order: 1,
							/* this properties aren't stored!
							only generated on server when populating dynamic assets */
							isGenerated: true,
							source: '1:1'
						},
					],
					formatConstraints: [
						{
							validationType: ValidationTypes.TYPE,
							validationSubType: TYPE_ValidationTypes.IS_TEXT,
							booleanConstraint: true
						}
					],
				}
			}];

			const s = await sequence.save(Seq).catch(e => {
				console.error('Your model gone wild...', e);
			});

			console.timeEnd('Fixed you a sequence');
			console.log(s);
		}

		const respondent = await getConnection().getRepository(Respondent);

		if ((await respondent.count()) === 0) {
			console.time('Fixed you a respondent');

			const Resp = new Respondent({
				name: 'Вася'
			});

			const re = await respondent.save(Resp).catch(e => {
				console.error('Your model gone wild...', e);
			});

			console.timeEnd('Fixed you a respondent');
			console.log(re);

		}

		const response = await getConnection().getRepository(SequenceResponse);

		if ((await response.count()) === 0) {
			console.time('Fixed you a response');

			const Res = new SequenceResponse(<SequenceResponse>{
				sequence: { id: 1 },
				respondent: { id: 1 },
				stepResponses: [
					{
						step: { id: 1 },
						response: {
							body: [
								{
									response: 'написал вам всякого'
								},
								{
									source: '1:1',
									response: 'nog een keer'
								}
							]
						}
					}
				]
			});

			const r = await response.save(Res).catch(e => {
				console.error('Your model gone wild...', e);
			});

			console.timeEnd('Fixed you a response');
			console.log(r);
		}
	}
}
