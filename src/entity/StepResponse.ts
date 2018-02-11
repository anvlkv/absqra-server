import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base } from './base';
import { Step } from './Step';
import { Response } from './Response';


@Entity()
export class StepResponse extends Base {
    @ManyToOne(type => Step, {
        eager: true,
    })
    @JoinColumn()
    step: Step;

    @OneToOne(type => Response, {
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    response?: Response;

    @Column({type: 'boolean', nullable: true})
    logicalCondition?: boolean;
}
