import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { Step } from '../../entity/Step';
import { Asset } from '../../entity/Asset';
import { FormatConstraint } from '../../entity/FormatConstraint';
import { getConnection } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { Item } from '../../entity/Item';
import { SequenceHeader } from '../../entity/SequenceHeader';
import { QuestionAsset } from '../../entity/QuestionAsset';
import { StepTypes } from '../../entity/enums/step.enums';


export const interviewerRouter = new Router();

interviewerRouter.get('getSequences', '/sequences', async (ctx, next) => {
    const Sequences = getConnection().getRepository(Sequence);

    ctx.body = await Sequences.find();
});
interviewerRouter.get('getSequence', '/sequences/:sequenceId', async (ctx, next) => {
    const Sequences = getConnection().getRepository(Sequence);

    ctx.body = await Sequences.findOne(ctx.params.sequenceId);
});

interviewerRouter.get('getItems', '/items', async (ctx, next) => {
    const Items = getConnection().getRepository(Item);

    ctx.body = await Items.find();
});
interviewerRouter.get('getItem', '/items/:itemId', async (ctx, next) => {
    const Items = getConnection().getRepository(Item);

    ctx.body = await Items.findOne(ctx.params.itemId);
});
interviewerRouter.get('referableItems', '/sequences/:sequenceId/items/referable/:fromStepId', async (ctx, next) => {
    let steps: Step[] = await getConnection()
    .createQueryBuilder()
    .relation(Sequence, 'steps')
    .of(ctx.params.sequenceId)
    .loadMany();

    const currentStep = await getConnection().getRepository(Step).findOne(ctx.params.fromStepId);

    steps = steps.filter((step) => {
        return step.order < currentStep.order && step.type == StepTypes.ITEM_REF;
    });

    const items = await Promise.all(steps.map(async (step) => {
        step.item = await getConnection()
        .createQueryBuilder()
        .relation(Step, 'item')
        .of(step)
        .loadOne();
        return step.item;
    }));

    ctx.body = items;
});


interviewerRouter.get('getAssets', '/assets', async (ctx, next) => {
    const Assets = getConnection().getRepository(Asset);

    ctx.body = await Assets.find();
});
interviewerRouter.get('getAsset', '/assets/:assetId', async (ctx, next) => {
    const Assets = getConnection().getRepository(Asset);

    ctx.body = await Assets.findOne(ctx.params.assetId);
});

interviewerRouter.get('getStep', '/steps/:stepId', async (ctx, next) => {
    const Steps = getConnection().getRepository(Step);

    ctx.body = await Steps.findOne(ctx.params.stepId);
});


// interviewerRouter.get('/responses/:responseId');
// interviewerRouter.get('/responses/:responseId/:itemId');
// interviewerRouter.get('/responses/:sequenceId/:respondentId');
// interviewerRouter.get('/responses/:sequenceId/:itemId/:respondentId');

interviewerRouter.post('addSequence', '/Sequences', koaBody(), async (ctx, next) => {
    // ctx.body = await Assets.findOne(ctx.params.assetId);
    const Sequences = getConnection().getRepository(Sequence);

    ctx.body = await Sequences.save(ctx.request.body);
});

interviewerRouter.post('addNewItemToSequence', '/sequences/:sequenceId/items', koaBody(), async (ctx, next) => {
    const Sequences = getConnection().getRepository(Sequence);
    const Steps = getConnection().getRepository(Step);

    const step = new Step();
    let sequence = await Sequences.findOne(ctx.params.sequenceId);

    step.item = ctx.request.body;
    step.item.question = new QuestionAsset();
    step.order = sequence.steps.length + 1;

    await Steps.save(step);

    sequence = {
        ...sequence,
        steps: [...sequence.steps, step],
    };

    await Sequences.save(sequence);

    ctx.body = await Steps.findOne(step.id);
});

// interviewerRouter.post('/responses');
// interviewerRouter.post('/responses/:responseId/:itemId');

interviewerRouter.post('addAssetToItem', '/items/:itemId/assets', koaBody(), async (ctx, next) => {
    const Items = getConnection().getRepository(Item);
    const item = await Items.findOne(ctx.params.itemId);

    // await Assets.create(ctx);
    const asset = new Asset({
        ...ctx.request.body,
        order: item.assets.length + 1,
    });

    item.assets = item.assets ? [...item.assets, asset] : [asset];

    await Items.save(item);

    ctx.body = asset;
});

interviewerRouter.post('setItemQuestion', '/items/:itemId/question', koaBody(), async (ctx, next) => {
    const Items = getConnection().getRepository(Item);
    const item = await Items.findOne(ctx.params.itemId);

    // await Assets.create(ctx);
    item.question = new QuestionAsset({
        ...ctx.request.body,
    });

    await Items.save(item);

    ctx.body = item.question;
});

interviewerRouter.post('addConstraintToItem', '/items/:itemId/formatConstraints', koaBody(), async (ctx, next) => {
    const Items = getConnection().getRepository(Item);

    const item = await Items.findOne(ctx.params.itemId);

    // await Assets.create(ctx);
    const constraint = new FormatConstraint(ctx.request.body);

    item.formatConstraints = item.formatConstraints ? [...item.formatConstraints, constraint] : [constraint];

    await Items.save(item);

    ctx.body = constraint;
});

interviewerRouter.post('addAsset', '/assets', koaBody(), async (ctx, next) => {
    const Assets = getConnection().getRepository(Asset);

    ctx.body = await Assets.save(ctx.request.body);
});

interviewerRouter.patch('updateSequenceHeader', '/sequences/:sequenceId/header', koaBody(), async (ctx, next) => {
    const Sequences = getConnection().getRepository(Sequence);
    const Headers = getConnection().getRepository(SequenceHeader);


    // let sequence = await Sequences.findOne(ctx.params.sequenceId);

    const result = await Sequences.createQueryBuilder()
    .where('Sequence.id = :id', {id: ctx.params.sequenceId})
    .leftJoinAndSelect('Sequence.header', 'Header')
    .getOne();

    // console.log(result);

    console.log(ctx.request.body);
    await Headers.update(result.header.id, ctx.request.body);
    ctx.body = await Sequences.findOne(ctx.params.sequenceId);
});

interviewerRouter.patch('updateItem', '/items/:itemId', koaBody(), async (ctx, next) => {
    const Items = getConnection().getRepository(Item);

    // ctx.request.body.id = ctx.request.body.id || ctx.params.itemId;
    let item = await Items.findOne(ctx.params.itemId);

    item = {
        ...item,
        ...ctx.request.body,
    };

    await Items.save(item);
    ctx.body = await Items.findOne(item.id);
});

interviewerRouter.patch('updateStep', '/sequences/:sequenceId/steps/:stepId', koaBody(), async (ctx, next) => {
    const Steps = getConnection().getRepository(Step);

    let step = await Steps.findOne(ctx.params.stepId);
    step = {
        ...step,
        ...ctx.request.body,
    };

    ctx.body = await Steps.update({id: ctx.params.stepId}, step);
});

interviewerRouter.patch('updateSequenceStepsOrder', '/sequences/:sequenceId/steps-order', koaBody(), async (ctx, next) => {
    const Steps = getConnection().getRepository(Step);
    const Sequences = getConnection().getRepository(Sequence);

    for (const stepIndex in ctx.request.body) {
        if (ctx.request.body.hasOwnProperty(stepIndex)) {
            await Steps.update(ctx.request.body[stepIndex].id, {order: ctx.request.body[stepIndex].order});
        }
    }

    ctx.body = await  Sequences.findOne(ctx.params.sequenceId);
});

interviewerRouter.patch('updateItemAssetsOrder', '/items/:itemId/assets-order', koaBody(), async (ctx, next) => {
    const Assets = getConnection().getRepository(Asset);
    const Items = getConnection().getRepository(Item);

    for (const assetIndex in ctx.request.body) {
        if (ctx.request.body.hasOwnProperty(assetIndex)) {
            await Assets.update(ctx.request.body[assetIndex].id, {order: ctx.request.body[assetIndex].order});
        }
    }

    ctx.body = await Items.findOne(ctx.params.itemId);
});


interviewerRouter.delete('/sequences/:sequenceId');
interviewerRouter.delete('deleteItem', '/items/:itemId', async (ctx) => {
    // TODO: Delete item from db and clear refs
    ctx.body = ctx.params.itemId;
});
interviewerRouter.delete('removeItem', 'Sequences/:sequenceId/:itemId', async (ctx) => {
    // TODO: remove item steps
    ctx.body = ctx.params.itemId;
});

interviewerRouter.delete('/assets/:assetId');
