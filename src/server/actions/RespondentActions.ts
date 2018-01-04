import * as Router from 'koa-router';
import { getConnection } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { Item, QuantityOrder } from '../../entity/Item';
import { SequenceResponse } from '../../entity/SequenceResponse';
import { Step, StepTypes } from '../../entity/Step';
import { Asset, AssetContentTypes, AssetTypes } from '../../entity/Asset';
import { ValidationTypes } from '../../entity/FormatConstraint';

export const respondentRouter = new Router();

respondentRouter.get('getSequence', '/:sequenceId', async (ctx, next) => {
	const sequence = await getConnection().getRepository(Sequence).findOne(ctx.params.sequenceId);
	let responseId = ctx.cookies.get('responseId');
	let sequenceResponse;
	if (!responseId) {
		sequenceResponse = await getConnection().getRepository(SequenceResponse).save(new SequenceResponse({
				sequence: {
					id: ctx.params.sequenceId
				}
			}));

		responseId = String(sequenceResponse.id);
		ctx.cookies.set('responseId', responseId);
	}
	else {
		sequenceResponse = await getConnection().getRepository(SequenceResponse).findOne(responseId);
	}

	if (sequenceResponse.stepResponses.length > 0) {
		sequence.steps = sequence.steps.filter(step => !!sequenceResponse.stepResponses.find(sr => sr.step.id === step.id))
	}


	ctx.body = sequence;
});

respondentRouter.get('getItem', '/:sequenceId/:stepId', async (ctx, next) => {
	const Sequences = await getConnection().getRepository(Sequence);

	const sequence = await Sequences.findOne(ctx.params.sequenceId);

	const requestedStep = sequence.steps.find(s => s.id == ctx.params.stepId);

	ctx.body = await prepareStepForResponse(requestedStep, ctx.cookies.get('responseId'));
});

respondentRouter.post('/:sequenceId');
respondentRouter.post('/:sequenceId/:itemId');

respondentRouter.patch('/:sequenceId/:itemId');

respondentRouter.delete('/:sequenceId');

async function prepareStepForResponse ({...step}: Step, responseId: number | string) {
	const response = await getConnection().getRepository(SequenceResponse).findOne(Number(responseId));

	if (response.stepResponses.find(r => r.step.id === step.id)) {
		throw Error(`Response ${responseId} already contains response for step ${step.id}`)
	}

	switch (step.type) {
		case StepTypes.ITEM_REF: {
			if (step.item.offers !== QuantityOrder.NONE) {
				step.item.assets = step.item.assets.reduce((whole, asset, currentIndex, array) => {

					if (asset.assetType === AssetTypes.DYNAMIC) {
						const referencedResponse = response.stepResponses.find(sr => sr.step.item.id === Number(asset.content));
						array.splice(currentIndex, 0, ...referencedResponse.response.body.map(body => {
							return new Asset({
								assetType: AssetTypes.STATIC,
								content: body.response,
								contentType: AssetContentTypes.TEXT,
								isGenerated: true,
								source: `${asset.id}:${referencedResponse.id}${body.source ? '|' + body.source : '+'}`
							});
						}));
					}

					return array;
				}, step.item.assets);
			}
			break;
		}
		case StepTypes.LOGIC: {

			break;
		}
		default: {

			break;
		}
	}

	return step;
}
