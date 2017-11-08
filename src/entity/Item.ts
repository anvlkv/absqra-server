import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Asset } from './Asset';


export enum ItemTypes {
	DISPLAY = 'display',
	SELECT = 'select',
	ADD = 'add',
	ASSGING = 'assign',
	COMPLETE = 'complete'
}

export enum ItemModes {
	SINGLE = 'single',
	MULTIPLE = 'multiple'
}

@Entity()
export class Item {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'char', length: 2000, nullable: true})
	description: string;

	@OneToMany(type => Asset, asset => asset.questionOf)
	@JoinTable()
	question: Asset;

	@Column({type: 'char', length: 32, default: ItemTypes.ASSGING})
	itemType: ItemTypes;

	@Column({type: 'char', length: 32, default: ItemModes.SINGLE})
	itemMode: ItemModes;

	@ManyToMany(type => Asset, {
		cascadeInsert: true,
		cascadeUpdate: true
	})
	@JoinTable()
	assets: Asset[];
}

