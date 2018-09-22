import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Base } from './base';
import { Sequence } from './sequence';
import { RespondentsList } from './respondentsList';
import { SequenceResponse } from './response';

@Entity({
    orderBy: {
        updatedDate: 'DESC'
    }
})
export class Project extends Base {
    @Column({type: 'char', length: 256, default: 'new project'})
    name?: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;



    @ManyToOne(type => Sequence, {
        cascade: true
    })
    @JoinColumn()
    topSequence: Sequence;
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
