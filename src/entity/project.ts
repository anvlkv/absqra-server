import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base';
import { Sequence } from './sequence';
import { RespondentsList } from './respondentsList';
import { SequenceResponse } from './response';

@Entity()
export class Project extends Base {
    @Column({type: 'char', length: 256, nullable: true})
    name?: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;

    @ManyToOne(type => Sequence, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    topSequence: Sequence;

    @ManyToMany(type => RespondentsList, {
        cascade: true,
        eager: true
    })
    @JoinTable()
    respondentsLists: RespondentsList[];

    @OneToMany(type => SequenceResponse, (response: SequenceResponse) => response.project, {
        cascade: true,
        eager: true
    })
    @JoinTable()
    responses: SequenceResponse[];

}
