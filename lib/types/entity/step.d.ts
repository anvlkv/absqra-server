import { Sequence } from './sequence';
import { OrderableBase } from './base';
import { StepTypes } from './enums/step.enums';
import { Question } from './question';
import { Task } from './task';
import { Logic } from './logic';
import { StepAsset } from './stepAsset';
export declare class Step extends OrderableBase {
    type: StepTypes;
    sequenceReference?: Sequence;
    questionReference?: Question;
    taskReference?: Task;
    logicReference?: Logic;
    assetReference?: StepAsset;
    sequence: Sequence;
}
