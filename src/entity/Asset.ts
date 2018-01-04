import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { OrderableBase } from './base';
import { Item } from './Item';

export enum AssetTypes {
    STATIC = 'static',
    DYNAMIC = 'dynamic'
}

export enum AssetContentTypes {
    TEXT = 'text',
    FILE = 'file',
    URL = 'url'
}

@Entity()
export class Asset extends OrderableBase {
	@Column({type: 'char', length: 32, default: AssetTypes.STATIC})
	assetType?: AssetTypes;

	@Column({type: 'char', length: 32, default: AssetContentTypes.TEXT})
	contentType?: AssetContentTypes;

	@Column({type: 'char', length: 2000, nullable: true})
	content?: string;

	@ManyToOne(type => Item, item => item.assets)
	item?: Item;

	isGenerated?: boolean;
	source?: string;
}

