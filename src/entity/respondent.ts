import { Entity, ManyToOne } from 'typeorm';
import { RespondentsList } from './respondentsList';
import { Base } from './base';

@Entity()
export class Respondent extends Base {

    @ManyToOne(type => RespondentsList, respondentsList => respondentsList.respondents)
    list: RespondentsList;

}
