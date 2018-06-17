import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Base } from './base';
import { Step } from './step';
import { SequenceResponse } from './response';
import { ResponseBody } from './responseBody';

@Entity()
export class StepResponse extends Base {
    @ManyToOne(type => Step)
    @JoinColumn()
    step: Step;
    @RelationId((stepResponse: StepResponse) => stepResponse.step)
    stepId?: number;

    @ManyToOne(type => SequenceResponse, response => response.stepResponses)
    response: SequenceResponse;

    @Column({type: 'json'})
    body: ResponseBody;

}
