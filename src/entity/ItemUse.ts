import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './Item';
import { Sequence } from './Sequence';

export enum ItemUseModes {
	SINGULAR = 'singular',
	PLURAL = 'plural'
}

export enum AssetsVisibilityModes {
	INDIVIDUAL = 'individual',
	COLLABORATIVE = 'collaborative'
}

@Entity()
export class ItemUse {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'char', length: 32, default: ItemUseModes.SINGULAR})
	useMode: ItemUseModes;

	@Column({type: 'boolean', default: true})
	modifiable: boolean;

	@Column({type: 'char', length: 32, default: AssetsVisibilityModes.INDIVIDUAL})
	assetsVisibilityMode: AssetsVisibilityModes;

	@Column({type: 'boolean', default: true})
	isItemOrigin: boolean;

	@OneToOne(type => Item, {
		cascadeAll: true
	})
	@JoinColumn()
	item: Item;

	@ManyToOne(type => Sequence)
	@JoinTable()
	sequence: Sequence;
}
