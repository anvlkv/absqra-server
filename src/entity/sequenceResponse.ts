import { Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Project } from './project';
import { Base } from './base';
import { Sequence } from './sequence';
import { StepResponse } from './stepResponse';
import { Respondent } from './respondent';

@Entity({
    orderBy: {
        updatedDate: 'DESC'
    }
})
export class SequenceResponse extends Base {

    @ManyToOne(type => Project, project => project.sequenceResponses)
    project?: Project;

    @ManyToOne(type => Sequence)
    @JoinColumn()
    sequence?: Sequence;
    @RelationId((sequenceResponse: SequenceResponse) => sequenceResponse.sequence)
    sequenceId?: number;

    // @ManyToOne(type => Respondent)
    // @JoinColumn()
    // respondent?: Respondent;
    // @RelationId((sequenceResponse: SequenceResponse) => sequenceResponse.respondent)
    // respondentId?: number;

    @OneToMany(type => StepResponse, stepResponse => stepResponse.sequenceResponse, {
        cascade: true
    })
    @JoinTable({
        name: 'sequenceResponse_stepResponses',
        joinColumn: {
            name: 'sequenceResponse',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'stepResponse',
            referencedColumnName: 'id'
        }
    })
    stepResponses?: StepResponse[];
    @RelationId((sequenceResponse: SequenceResponse) => sequenceResponse.stepResponses)
    stepResponsesIds?: string[];
}
