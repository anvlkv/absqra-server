import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './Item';
import { Sequence } from './Sequence';
import { OrderableBase } from './base';
import { LogicTypes, StepTypes } from './enums/step.enums';


@Entity()
export class Step extends OrderableBase {

    @Column({type: 'char', length: 32, default: StepTypes.ITEM_REF})
    type?: StepTypes;

    @ManyToOne(type => Item, {
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    item?: Item;

    @Column({type: 'char', length: 32, default: LogicTypes.ONE, nullable: true})
    logic?: LogicTypes;

    @Column({type: 'boolean', default: true})
    isItemOrigin?: boolean;

    @ManyToOne(type => Sequence, sequence => sequence.steps)
    sequence?: Sequence;
}
