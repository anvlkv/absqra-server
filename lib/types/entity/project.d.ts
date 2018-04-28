import { Base } from './base';
import { Sequence } from './sequence';
import { RespondentsList } from './respondentsList';
import { Response } from './response';
export declare class Project extends Base {
    name?: string;
    description?: string;
    sequence: Sequence;
    respondentsLists: RespondentsList[];
    responses: Response[];
}
