import { Column, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { ItemUse } from './ItemUse';


export enum SequenceModes {
	SELECT = 'select',
	ADD = 'add',
	ASSIGN = 'assign'
}

@Entity()
export class Sequence {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'char', length: 256})
	name: string;

	@Column({type: 'char', length: 2000, nullable: true})
	description: string;

	@Column({type: 'char', length: 32, default: SequenceModes.ADD})
	sequenceMode: SequenceModes;

	@OneToMany(type => ItemUse, use => use.sequence, {
		cascadeInsert: true,
		cascadeUpdate: true
	})
	@JoinTable()
	use: ItemUse[];
}
