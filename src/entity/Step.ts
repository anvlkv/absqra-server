import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './Item';
import { Sequence } from './Sequence';
import { OrderableBase } from './base';

export enum StepTypes {
	ITEM_REF = 'item_reference',
	LOGIC = 'logic'
}

export enum LogicTypes {
	ONE = 'one',
	TWO = 'two'
}

@Entity()
export class Step extends OrderableBase {

	@Column({type: 'char', length: 32, default: StepTypes.ITEM_REF})
	type?: StepTypes;

	@ManyToOne(type => Item, {
		cascade: true,
		eager: true
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
