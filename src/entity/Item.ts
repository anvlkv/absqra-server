import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { Asset } from './Asset';
import { FormatConstraint } from './FormatConstraint';
import { Base } from './base';


export enum ItemLifeCycleTypes {
	ONE_ONE = '1:1',
	N_ONE = 'N:1',
	ONE_N = '1:N',
	N_N = 'N:N'
}

export enum QuantityOrder {
	NONE = 'none',
	ONE = 'one',
	MULTIPLE = 'multiple',
	NDIMENSIONAL = 'ndimensional',
}

@Entity()
export class Item extends Base {

	@Column({type: 'char', length: 256, nullable: true})
	name?: string;

	@Column({type: 'char', length: 2000, nullable: true})
	description?: string;

	@OneToOne(type => Asset, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	question: Asset;

	@Column({type: 'char', length: 32, default: QuantityOrder.NONE})
	offers: QuantityOrder;

	@Column({type: 'char', length: 32, default: QuantityOrder.NONE})
	expects: QuantityOrder;

	@Column({type: 'char', length: 32, default: ItemLifeCycleTypes.ONE_ONE})
	lifeCycle: ItemLifeCycleTypes;

	@OneToMany(type => FormatConstraint, fc => fc.item, {
		cascade: true,
		eager: true
	})
	@JoinTable()
	formatConstraints?: FormatConstraint[];

	@OneToMany(type => Asset, asset => asset.item, {
		cascade: true,
		eager: true
	})
	@JoinTable()
	assets?: Asset[];
}

