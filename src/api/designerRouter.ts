import * as Router from 'koa-router';
import { getConnection } from 'typeorm';
import { Project, Question, SequenceResponse, Step, StepTypes } from '../entity';
import { RouterManagerBase } from './RouterManagerBase';

/* TODO: add views like
 *   - all referable steps of sequence
 *   - all referable sequences
 *   - all referable step items (questions etc)
 */

export class DesignerRouter extends Router {
    private routPrefix = '/designer';

    constructor (
    ) {
        super();

        // this.get('viewExecutableQuestion', `${this.routPrefix}/question-exec/:executableQuestionId`, this.viewExecutableQuestion());
        //
        // this.post('saveStepResponse', `${this.routPrefix}/step-response/:sequenceId/:stepId`, this.saveStepResponse())
        this.get('viewReferableSteps', `${this.routPrefix}/referable-steps/:projectId/:stepId`, this.viewReferableSteps());

        this.post('saveTopSequenceOfProject', `${this.routPrefix}/save-top-sequence/:projectId`, this.saveTopSequenceOfProject())
    }

    private viewReferableSteps(localName = 'viewReferableSteps') {
        const middlewear = async (ctx, next) => {
            const project = await getConnection()
                .getRepository(Project)
                .createQueryBuilder('project')
                .leftJoinAndSelect('project.topSequence', 'topSequence')
                .leftJoinAndSelect('topSequence.steps', 'steps')
                .where('project.id = :id', {id: ctx.params['projectId']})
                .getOne();

            const step = await getConnection()
                .getRepository(Step)
                .createQueryBuilder('step')
                .leftJoinAndSelect('step.sequence', 'sequence')
                .where('step.id = :id', { id: ctx.params['stepId'] })
                .getOne();


            if (project.topSequenceId === step.sequence.id) {
                ctx.body = project.topSequence.steps.filter(s => {
                    return s.order < step.order
                }).map(({id}) => id);
            }
            else {
                ctx.throw('deep reference not supported');
            }

        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});
        return middlewear;
    }

    private saveTopSequenceOfProject(localName = 'sequence') {
        const middlewear = async (ctx, next) => {
            const repo = await getConnection()
                .getRepository(Project);

            const project = await repo.findOne(ctx.params['projectId']);


            project.topSequence = ctx.request.body;

            const saveResult = await repo.save(project);

            ctx.body = saveResult.topSequence;

        };

        Object.defineProperty(middlewear, 'name', {value: localName, writable: false});
        return middlewear;
    }
}


