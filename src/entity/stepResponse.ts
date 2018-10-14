import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Base } from './base';
import { Step } from './step';
import { SequenceResponse } from './sequenceResponse';
import { ResponseBody } from './responseBody';

@Entity()
export class StepResponse extends Base {

    @ManyToOne(type => Step)
    @JoinColumn()
    step?: Step;
    @RelationId((stepResponse: StepResponse) => stepResponse.step)
    stepId?: number;

    @ManyToOne(type => SequenceResponse, response => response.stepResponses)
    sequenceResponse?: SequenceResponse;
    @RelationId((response: StepResponse) => response.sequenceResponse)
    sequenceResponseId?: string;

    @Column({type: 'json'})
    body?: ResponseBody;
}
