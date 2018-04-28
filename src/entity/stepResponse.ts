import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Step } from './step';
import { Response } from './response';
import { ResponseBody } from './responseBody';

@Entity()
export class StepResponse extends Base {
    @ManyToOne(type => Step)
    @JoinColumn()
    step: Step;

    @ManyToOne(type => Response, response => response.stepResponses)
    response: Response;

    @Column({type: 'json'})
    body: ResponseBody;

}
