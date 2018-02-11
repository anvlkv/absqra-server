import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Sequence } from './Sequence';
import { StepResponse } from './StepResponse';
import { Respondent } from './Respondent';


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
