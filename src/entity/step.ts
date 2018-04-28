import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { Sequence } from './sequence';
import { OrderableBase } from './base';
import { StepTypes } from './enums/step.enums';
import { QuestionAsset } from './questionAsset';
import { Question } from './question';
import { Task } from './task';
import { Logic } from './logic';
import { StepAsset } from './stepAsset';


@Entity()
export class Step extends OrderableBase {

    @Column({type: 'char', length: 32, default: StepTypes.ITEM_REF})
    type: StepTypes;

    @ManyToOne(type => Sequence, sequence => sequence.referencedBySteps, {
        cascade: true
    })
    @JoinTable()
    sequenceReference?: Sequence;

    @ManyToOne(type => Question, {
        cascade: true
    })
    @JoinTable()
    questionReference?: Question;

    @ManyToOne(type => Task, {
        cascade: true
    })
    @JoinTable()
    taskReference?: Task;

    @ManyToOne(type => Logic, {
        cascade: true
    })
    @JoinTable()
    logicReference?: Logic;

    @ManyToOne(type => StepAsset, {
        cascade: true
    })
    @JoinTable()
    assetReference?: StepAsset;

    @ManyToOne(type => Sequence, sequence => sequence.steps)
    sequence: Sequence;
}
