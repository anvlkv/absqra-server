import { Entity, JoinColumn, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './project';
import { Base } from './base';
import { Sequence } from './sequence';
import { StepResponse } from './stepResponse';
import { Respondent } from './respondent';

@Entity()
export class Response extends Base {

    @ManyToOne(type => Project, project => project.responses)
    project: Project;

    @ManyToOne(type => Sequence)
    @JoinColumn()
    sequence: Sequence;

    @ManyToOne(type => Respondent)
    @JoinColumn()
    respondent: Respondent;

    @OneToMany(type => StepResponse, stepResponse => stepResponse.response, {
        cascade: true,
        eager: true
    })
    @JoinTable()
    stepResponses: StepResponse[];
}
