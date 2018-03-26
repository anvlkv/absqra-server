import { AfterLoad, JoinColumn, JoinTable, OneToMany, OneToOne, } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Step } from './step';
import { Base } from './base';
import { SequenceHeader } from './sequenceHeader';


@Entity({
    // orderBy: {
    // 	updatedDate: 'DESC',
    // }
})
export class Sequence extends Base {
    @OneToOne(type => SequenceHeader, {
        eager: true,
        cascade: true,
    })
    @JoinColumn()
    header?: SequenceHeader;

    @OneToMany(type => Step, step => step.sequence, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    steps?: Step[];

    @AfterLoad()
    sortSteps?() {
        if (this.steps) {
            this.steps.sort((s1, s2) => s1.order - s2.order);
        }
    }
}
