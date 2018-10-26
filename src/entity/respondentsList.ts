import { Entity, JoinTable, OneToMany, RelationId } from 'typeorm';
import { Respondent } from './respondent';
import { Base } from './base';

@Entity()
export class RespondentsList extends Base {
    @OneToMany(type => Respondent, respondent => respondent.list, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'respondentsList_respondents',
        joinColumn: {
            name: 'respondentsList',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'respondent',
            referencedColumnName: 'id'
        }
    })
    respondents: Respondent[];
    @RelationId((respondent: RespondentsList) => respondent.respondents)
    respondentsIds?: string[];
}
