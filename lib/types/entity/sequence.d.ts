import { Step } from './step';
import { Base } from './base';
import { SequenceHeader } from './sequenceHeader';
export declare class Sequence extends Base {
    header?: SequenceHeader;
    steps?: Step[];
    stepIds?: number[];
    referencedBySteps?: Sequence[];
}
