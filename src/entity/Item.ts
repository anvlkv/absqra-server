import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { Asset } from './Asset';
import { FormatConstraint } from './FormatConstraint';
import { Base } from './base';
import { QuestionAsset } from './QuestionAsset';


export enum ItemLifeCycleTypes {
	ONE_ONE = '1:1',
	N_ONE = 'N:1',
	ONE_N = '1:N',
	N_N = 'N:N'
}

export enum QuantityOrder {
	NONE = 'none',
	ONE = 'one',
	MULTIPLE = 'multiple'
}

@Entity()
export class Item extends Base {

	@Column({type: 'char', length: 256, nullable: true})
	name?: string;

	@Column({type: 'char', length: 2000, nullable: true})
	description?: string;

	@OneToOne(type => QuestionAsset, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	question: QuestionAsset;

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
	@JoinTable({name: 'constraints_of_item'})
	formatConstraints?: FormatConstraint[];

	@OneToMany(type => Asset, asset => asset.item, {
		cascade: true,
		eager: true
	})
	@JoinTable({name: 'assets_of_item'})
	assets?: Asset[];
}

