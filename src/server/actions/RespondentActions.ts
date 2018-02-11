import * as Router from 'koa-router';
import { getConnection } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { SequenceResponse } from '../../entity/SequenceResponse';
import * as koaBody from 'koa-body';
import { StepResponse } from '../../entity/StepResponse';
import { Step } from '../../entity/Step';
import { QuantityOrder } from '../../entity/enums/item.enums';
import { StepTypes } from '../../entity/enums/step.enums';


export const respondentRouter = new Router();


respondentRouter.get('getSequencesThatCanBeAnswered', '/sequences-that-can-be-answered', async (ctx, next) => {
    const Sequences = getConnection().getRepository(Sequence);

    ctx.body = await Sequences.find();
});

respondentRouter.get('getSequence', '/:sequenceId', async (ctx, next) => {
    const sequence = await getConnection().getRepository(Sequence).findOne(ctx.params.sequenceId);
    let sequenceResponse;

    if (!ctx.session.responseId) {
        sequenceResponse = await getConnection().getRepository(SequenceResponse).save(new SequenceResponse({
            sequence: {
                id: ctx.params.sequenceId,
            },
        }));

        ctx.session.responseId = String(sequenceResponse.id);
    }
    else {
        sequenceResponse = await getConnection().getRepository(SequenceResponse).findOne(ctx.session.responseId);
    }

    if (sequenceResponse && sequenceResponse.stepResponses && sequenceResponse.stepResponses.length > 0) {
        sequence.steps = sequence.steps.filter(step => !!sequenceResponse.stepResponses.find(sr => sr.step.id === step.id));
    }
    ctx.body = sequence;
});

respondentRouter.get('getStep', '/:sequenceId/:stepId', async (ctx, next) => {
    const Sequences = await getConnection().getRepository(Sequence);

    const sequence = await Sequences.findOne(ctx.params.sequenceId);

    const response = await getConnection().getRepository(SequenceResponse).findOne(ctx.session.responseId);

    const requestedStep = sequence.steps.find(s => s.id == ctx.params.stepId);

    const adjustedStepId = adjustStepId(sequence, requestedStep, response);

    if (requestedStep.id != adjustedStepId) {
        ctx.redirect(`/${ctx.params.sequenceId}/${adjustedStepId}`);
        next();
    }

    ctx.body = await prepareStepForResponse(requestedStep, ctx.session.responseId);
});

respondentRouter.post('/:sequenceId');
respondentRouter.post('saveResponse', '/:sequenceId/:stepId', koaBody(), async (ctx, next) => {
    const Responses = await getConnection().getRepository(SequenceResponse);
    const response = await Responses.findOne(ctx.session.responseId);


    // console.log(response);

    response.stepResponses.push(new StepResponse(<StepResponse>{
        step: {
            id: ctx.params.stepId,
        },
        response: {
            body: ctx.request.body,
        },
    }));

    await Responses.save(response);

    ctx.body = response;
});

respondentRouter.patch('/:sequenceId/:itemId');

respondentRouter.delete('/:sequenceId');

function adjustStepIndex(sequence: Sequence, step: Step, sequenceResponse: SequenceResponse): number {
    const requestedIndex = sequence.steps.findIndex(s => s.id == step.id);
    const prevStep = sequence.steps[requestedIndex - 1];
    const nextStep = sequence.steps[requestedIndex + 1];

    if (!sequenceResponse) {
        return 0;
    }

    // if (!nextStep) {
    // 	return null;
    // }

    if (sequenceResponse.stepResponses.every(
            (sr, sri) => Array.apply(null, {length: requestedIndex}).map(Function.call, Number)
            .indexOf(sri) >= 0 && sequence.steps[sri].id == sr.step.id)
    ) {
        return requestedIndex;
    }

    return sequenceResponse.stepResponses.length;
}

function adjustStepId(sequence: Sequence, step: Step, sequenceResponse: SequenceResponse): number {
    return sequence.steps[adjustStepIndex(sequence, step, sequenceResponse)].id;
}

async function prepareStepForResponse({...step}: Step, responseId: number | string) {
    const response = await getConnection().getRepository(SequenceResponse).findOne(Number(responseId));

    switch (step.type) {
        case StepTypes.ITEM_REF: {
            if (step.item.offers !== QuantityOrder.NONE) {
                // step.item.assets = step.item.assets.reduce((whole, asset, currentIndex, array) => {
                //
                //     if (asset.assetType === AssetTypes.DYNAMIC) {
                //         const referencedResponse = response.stepResponses.find(sr => sr.step.item.id === Number(asset.content));
                //
                //         array.splice(currentIndex, 0, ...referencedResponse.response.body.map(body => {
                //             return new Asset({
                //                 assetType: AssetTypes.STATIC,
                //                 content: body.response,
                //                 contentType: AssetContentTypes.TEXT,
                //                 isGenerated: true,
                //                 source: `${asset.id}:${referencedResponse.id}${body.source ? '|' + body.source : '+'}`,
                //             });
                //         }));
                //     }
                //
                //     return array;
                // }, step.item.assets);
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
