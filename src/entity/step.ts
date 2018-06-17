import { Column, Entity, JoinTable, ManyToOne, RelationId } from 'typeorm';
import { Sequence } from './sequence';
import { StepTypes } from './enums/step.enums';
import { Question } from './question';
import { Task } from './task';
import { Logic } from './logic';
import { StepAsset } from './stepAsset';
import { OrderableBase } from './orderableBase';
import { enumerableColumnProperties } from '../util/helpers';


@Entity({
    orderBy: {
        order: 'ASC'
    }
})
export class Step extends OrderableBase {

    @Column({...enumerableColumnProperties, nullable: true})
    type: StepTypes;

    @ManyToOne(type => Sequence, sequence => sequence.referencedBySteps, {
        cascade: true
    })
    @JoinTable()
    sequenceReference?: Sequence;
    @RelationId((step: Step) => step.sequenceReference)
    sequenceReferenceId?: number;

    @ManyToOne(type => Question, {
        cascade: true
    })
    @JoinTable()
    questionReference?: Question;
    @RelationId((step: Step) => step.questionReference)
    questionReferenceId?: number;

    @ManyToOne(type => Task, {
        cascade: true
    })
    @JoinTable()
    taskReference?: Task;
    @RelationId((step: Step) => step.taskReference)
    taskReferenceId?: number;

    @ManyToOne(type => Logic, {
        cascade: true
    })
    @JoinTable()
    logicReference?: Logic;
    @RelationId((step: Step) => step.logicReference)
    logicReferenceId?: number;

    @ManyToOne(type => StepAsset, {
        cascade: true
    })
    @JoinTable()
    assetReference?: StepAsset;
    @RelationId((step: Step) => step.assetReference)
    assetReferenceId?: number;

    @ManyToOne(type => Sequence, sequence => sequence.steps)
    sequence?: Sequence;
}
