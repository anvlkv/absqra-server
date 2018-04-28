import { Base } from './base';
import { Step } from './step';
import { Response } from './response';
import { ResponseBody } from './responseBody';
export declare class StepResponse extends Base {
    step: Step;
    response: Response;
    body: ResponseBody;
}
