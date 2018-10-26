import * as Router from 'koa-router';
import { getConnection } from 'typeorm';
import {
    AssetBase,
    AssetTypes,
    Question,
    QuestionAsset,
    QuestionContentAsset,
    ResponseAsset,
    SequenceResponse,
} from '../entity';

/* TODO: add views like
 *   - all of a sudden question view for respondent
 */

export class RespondentRouter extends Router {
    private routPrefix = '/respondent';

    constructor () {
        super();

        this.get('viewExecutableQuestion', `${this.routPrefix}/question-exec/:executableQuestionId/:responseId`, this.viewExecutableQuestion());

        this.post('saveStepResponse', `${this.routPrefix}/step-response/:sequenceId/:stepId`, this.saveStepResponse())
    }

    private viewExecutableQuestion(localName = 'executableQuestion') {
        const middlewear = async (ctx, next) => {
            const question = await getConnection()
                .getRepository(Question)
                .createQueryBuilder('question')
                .leftJoinAndSelect('question.contentAsset', 'contentAsset')
                .leftJoinAndSelect('question.formatConstraints', 'formatConstraints')
                .leftJoinAndSelect('question.questionAssets', 'questionAssets')
                .leftJoinAndSelect('question.responseAssets', 'responseAssets')
                .where('question.id = :id', { id: ctx.params[`${localName}Id`] })
                .getOne();

            [question.contentAsset] = await this.populateDynamicAsset<QuestionContentAsset>([question.contentAsset], ctx.params['responseId'], QuestionContentAsset);

            question.questionAssets = await this.populateDynamicAsset<QuestionAsset>(question.questionAssets, ctx.params['responseId'], QuestionAsset);
            question.responseAssets = await this.populateDynamicAsset<ResponseAsset>(question.responseAssets, ctx.params['responseId'], ResponseAsset);

            ctx.body = question;
        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});
        return middlewear;
    }

    private async populateDynamicAsset<T extends AssetBase>(assets: T[], responseId: string, Type): Promise<T[]> {
        const response = await getConnection()
            .getRepository(SequenceResponse)
            .findOne(responseId, {relations: ['stepResponses']});

        let indexShift = 0;
        assets = assets.filter(a => a.assetType === AssetTypes.DYNAMIC).reduce((totalAssets, dynamicAsset, at, all) => {
            const  sourceResponse = response.stepResponses.find(s => s.stepId === dynamicAsset.sourceStepId);

            if (sourceResponse.body.content instanceof Array) {
                totalAssets.splice(at + indexShift, 1, ...sourceResponse.body.content.reduce((acc, c, i, a) => {
                    if (!totalAssets.find(asset => asset.content === c.content)) {
                        acc.push(<T> new Type({
                                // @ts-ignore
                                ...dynamicAsset,
                                content: c.content,
                                order: at + indexShift + i,
                                isGenerated: true
                            })
                        )
                    }
                    return acc;
                }, []));

                indexShift += sourceResponse.body.content.length - 1;
            }
            else if (!totalAssets.find(asset => asset.content === sourceResponse.body.content)) {
                totalAssets.splice(at + indexShift, 1, new Type({
                    // @ts-ignore
                    ...dynamicAsset,
                    content: sourceResponse.body.content,
                    order: at + indexShift,
                    isGenerated: true
                }));
            }
            else {
                totalAssets.splice(at + indexShift, 1);
            }

            return totalAssets;
        }, assets);

        return assets;
    }

    private saveStepResponse(localName = 'stepResponseResult') {
        const middlewear = async (ctx, next) => {
            const sequenceResponse = await getConnection()
                .getRepository(SequenceResponse)
                .findOne(ctx.params.sequenceId);

            console.log(sequenceResponse);

            ctx.body = true;
        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});
        return middlewear;
    }





}


