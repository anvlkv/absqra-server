import { Project } from './project';
import { Base } from './base';
import { Sequence } from './sequence';
import { StepResponse } from './stepResponse';
import { Respondent } from './respondent';
export declare class SequenceResponse extends Base {
    project: Project;
    sequence: Sequence;
    sequenceId?: number;
    respondent: Respondent;
    respondentId?: number;
    stepResponses: StepResponse[];
    stepResponsesIds?: number[];
}
