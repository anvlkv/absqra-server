import { Column, Entity, JoinTable, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Sequence } from './sequence';
import { StepTypes } from './enums/step.enums';
import { Question } from './question/entity';
import { Task } from './task';
import { Logic } from './logic';
import { StepAsset } from './stepAsset';
import { OrderableBase } from './orderableBase';
import { enumerableColumnProperties } from '../util/helpers';


@Entity({
    orderBy: {
        order: `ASC`
    }
})
export class Step extends OrderableBase {

    @Column({...enumerableColumnProperties})
    type?: StepTypes;

    @ManyToOne(type => Sequence, sequence => sequence.referencedBySteps, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'step_sequenceReference',
        joinColumn: {
            name: 'step',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'sequenceReference',
            referencedColumnName: 'id'
        }
    })
    sequenceReference?: Sequence;
    @RelationId((step: Step) => step.sequenceReference)
    sequenceReferenceId?: string;

    @ManyToOne(type => Question, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'step_questionReference',
        joinColumn: {
            name: 'step',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'questionReference',
            referencedColumnName: 'id'
        }
    })
    questionReference?: Question;
    @RelationId((step: Step) => step.questionReference)
    questionReferenceId?: string;

    @ManyToOne(type => Task, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'step_taskReference',
        joinColumn: {
            name: 'step',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'taskReference',
            referencedColumnName: 'id'
        }
    })
    taskReference?: Task;
    @RelationId((step: Step) => step.taskReference)
    taskReferenceId?: string;

    @ManyToOne(type => Logic, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'step_logicReference',
        joinColumn: {
            name: 'step',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'logicReference',
            referencedColumnName: 'id'
        }
    })
    logicReference?: Logic;
    @RelationId((step: Step) => step.logicReference)
    logicReferenceId?: string;

    @ManyToOne(type => StepAsset, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'step_assetReference',
        joinColumn: {
            name: 'step',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'assetReference',
            referencedColumnName: 'id'
        }
    })
    assetReference?: StepAsset;
    @RelationId((step: Step) => step.assetReference)
    assetReferenceId?: string;

    @ManyToOne(type => Sequence, sequence => sequence.steps)
    sequence?: Sequence;
    @RelationId((step: Step) => step.sequence)
    sequenceId?: string;

}
