import * as Router from 'koa-router';
import { getConnection } from 'typeorm';
import { Question, SequenceResponse } from '../entity/index';

/* TODO: add views like
 *   - all referable steps of sequence
 *   - all referable sequences
 *   - all referable step items (questions etc)
 *   - all of a sudden question view for respondent
 */

export class RespondentRouter extends Router {
    private routPrefix = '/respondent';

    constructor () {
        super();

        this.get('viewExecutableQuestion', `${this.routPrefix}/question-exec/:executableQuestionId`, this.viewExecutableQuestion());

        this.post('saveStepResponse', `${this.routPrefix}/step-response/:sequenceId/:stepId`, this.saveStepResponse())
    }

    private viewExecutableQuestion(localName = 'executableQuestion') {
        const middlewear = async (ctx, next) => {
            ctx.body = await getConnection()
                .getRepository(Question)
                .createQueryBuilder('question')
                .leftJoinAndSelect('question.contentAsset', 'contentAsset')
                .leftJoinAndSelect('question.formatConstraints', 'formatConstraints')
                .leftJoinAndSelect('question.questionAssets', 'questionAssets')
                .leftJoinAndSelect('question.responseAssets', 'responseAssets')
                .where('question.id = :id', { id: ctx.params[`${localName}Id`] })
                .getOne();
        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});
        return middlewear;
    }

    private saveStepResponse(localName = 'stepResponseResult') {
        const middlewear = async (ctx, next) => {
            const sequenceResponse = await getConnection()
                .getRepository(SequenceResponse)
                .findOne(ctx.params.sequenceId);

            console.log(sequenceResponse);

            // const step = new StepResponse({});

            ctx.body = true;

            // ctx.body = await getConnection()
            // .getRepository(Question)
            // .createQueryBuilder('question')
            // .leftJoinAndSelect('question.contentAsset', 'contentAsset')
            // .leftJoinAndSelect('question.formatConstraints', 'formatConstraints')
            // .leftJoinAndSelect('question.questionAssets', 'questionAssets')
            // .leftJoinAndSelect('question.responseAssets', 'responseAssets')
            // .where('question.id = :id', { id: ctx.params[`${localName}Id`] })
            // .getOne();
        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});
        return middlewear;
    }





}


