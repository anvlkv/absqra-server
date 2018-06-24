import { Base } from './base';
import { Sequence } from './sequence';
import { RespondentsList } from './respondentsList';
import { SequenceResponse } from './response';
export declare class Project extends Base {
    name?: string;
    description?: string;
    topSequence: Sequence;
    topSequenceId?: number;
    respondentsLists: RespondentsList[];
    respondentsListsIds?: number[];
    responses: SequenceResponse[];
    responsesIds?: number[];
}
