import { AfterLoad, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, RelationId, } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Step } from './step';
import { Base } from './base';
import { SequenceHeader } from './sequenceHeader';
import { Project } from './project';


@Entity({
    orderBy: {
        updatedDate: `DESC`,
    }
})
export class Sequence extends Base {

    @OneToOne(type => SequenceHeader, {
        eager: true,
        cascade: true,
        nullable: false
    })
    @JoinColumn()
    header?: SequenceHeader;


    @OneToMany(type => Step, step => step.sequence, {
        cascade: true,
        nullable: false
    })
    @JoinTable({
        name: 'sequence_steps',
        joinColumn: {
            name: 'sequence',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'step',
            referencedColumnName: 'id'
        }
    })
    steps?: Step[];

    @RelationId((sequence: Sequence) => sequence.steps)
    stepsIds?: string[];

    @ManyToMany(type => Step, step => step.sequenceReference)
    referencedBySteps?: Sequence[];

    @OneToOne(type => Project, project => project.topSequence)
    project?: Project;

    @RelationId((sequence: Sequence) => sequence.project)
    projectId?: Project;
}
