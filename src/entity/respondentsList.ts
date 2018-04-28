import { Entity, JoinTable, OneToMany } from 'typeorm';
import { Respondent } from './respondent';
import { Base } from './base';

@Entity()
export class RespondentsList extends Base {
    @OneToMany(type => Respondent, respondent => respondent.list, {
        cascade: true,
        eager: true
    })
    @JoinTable()
    respondents: Respondent[];
}
