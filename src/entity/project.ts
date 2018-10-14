import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, RelationId } from 'typeorm';
import { Base } from './base';
import { Sequence } from './sequence';
import { RespondentsList } from './respondentsList';
import { SequenceResponse } from './sequenceResponse';

@Entity({
    orderBy: {
        updatedDate: 'DESC'
    }
})
export class Project extends Base {
    @Column({type: 'varchar', length: 500, default: 'new project'})
    name?: string;

    @Column({type: 'text', nullable: true})
    description?: string;



    @OneToOne(type => Sequence, sequence => sequence.project, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    topSequence?: Sequence;
    @RelationId((project: Project) => project.topSequence)
    topSequenceId?: number;



    @ManyToMany(type => RespondentsList, {
        cascade: true
    })
    @JoinTable()
    respondentsLists: RespondentsList[];
    @RelationId((project: Project) => project.respondentsLists)
    respondentsListsIds?: string[];



    @OneToMany(type => SequenceResponse, (response: SequenceResponse) => response.project, {
        cascade: true
    })
    @JoinTable()
    sequenceResponses: SequenceResponse[];
    @RelationId((project: Project) => project.sequenceResponses)
    sequenceResponsesIds?: string[];

}
