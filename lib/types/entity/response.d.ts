import { Project } from './project';
import { Base } from './base';
import { Sequence } from './sequence';
import { StepResponse } from './stepResponse';
import { Respondent } from './respondent';
export declare class Response extends Base {
    project: Project;
    sequence: Sequence;
    respondent: Respondent;
    stepResponses: StepResponse[];
}
