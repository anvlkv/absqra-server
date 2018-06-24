import { Base } from './base';
import { SequenceLifeCycleTypes } from './enums/sequence.enums';
export declare class SequenceHeader extends Base {
    name: string;
    description?: string;
    lifeCycle: SequenceLifeCycleTypes;
}
