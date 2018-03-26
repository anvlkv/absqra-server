import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Sequence } from './sequence';
import { StepResponse } from './stepResponse';
import { Respondent } from './respondent';


@Entity()
export class SequenceResponse extends Base {
    @ManyToOne(type => Sequence)
    @JoinColumn()
    sequence: Sequence;

    @ManyToOne(type => Respondent)
    @JoinColumn()
    respondent: Respondent;

    @ManyToMany(type => StepResponse, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    stepResponses: StepResponse[];
}
