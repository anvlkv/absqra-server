import * as Router from 'koa-router';
import { createQueryBuilder, getConnection } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Question } from '../entity';

/* TODO: add views like
 *   - all referable steps of sequence
 *   - all referable sequences
 *   - all referable step items (questions etc)
 *   - all of a sudden question view for respondent
 */

export class ViewRouter {
    constructor(
        public router = new Router(),
        private prefix = '/view'
    ) {
        this.registerViewExecutableQuestion();
    }

    private registerViewExecutableQuestion() {
        const localName = 'executableQuestion'
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

            ctx.body = question;
        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});

        this.router.get('viewExecutableQuestion', `${this.prefix}/question-exec/:${localName}Id`, middlewear)
    }

}


