import { AfterLoad, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, RelationId, } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Step } from './step';
import { Base } from './base';
import { SequenceHeader } from './sequenceHeader';


@Entity({
    orderBy: {
        updatedDate: 'DESC',
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
        cascade: true
    })
    @JoinTable()
    steps?: Step[];

    @RelationId((sequence: Sequence) => sequence.steps)
    stepIds?: string[];

    @ManyToMany(type => Step, step => step.sequenceReference)
    referencedBySteps?: Sequence[];
}
