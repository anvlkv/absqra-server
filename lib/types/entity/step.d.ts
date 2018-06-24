import { Sequence } from './sequence';
import { StepTypes } from './enums/step.enums';
import { Question } from './question';
import { Task } from './task';
import { Logic } from './logic';
import { StepAsset } from './stepAsset';
import { OrderableBase } from './orderableBase';
export declare class Step extends OrderableBase {
    type: StepTypes;
    sequenceReference?: Sequence;
    sequenceReferenceId?: number;
    questionReference?: Question;
    questionReferenceId?: number;
    taskReference?: Task;
    taskReferenceId?: number;
    logicReference?: Logic;
    logicReferenceId?: number;
    assetReference?: StepAsset;
    assetReferenceId?: number;
    sequence?: Sequence;
}
