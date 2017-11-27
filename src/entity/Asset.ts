import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from './base';

export enum AssetTypes {
    STATIC = 'static',
    DYNAMIC = 'dynamic'
}

export enum AssetContentTypes {
    TEXT = 'text',
    FILE = 'file',
    URL = 'url',
    SUBSET = 'subset'
}


@Entity()
export class Asset extends Base {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'char', length: 32, default: AssetTypes.STATIC})
    assetType: AssetTypes;

    @Column({type: 'char', length: 32, default: AssetContentTypes.TEXT})
    contentType: AssetContentTypes;

    @Column({type: 'char', length: 2000, nullable: true})
    content?: string;

	@ManyToOne(type => Asset, asset => asset.subset, {
		nullable: true
	})
	@JoinColumn()
	containedInAsset?: Asset;

	@OneToMany(type => Asset, asset => asset.containedInAsset, {
		cascade: true
	})
    @JoinTable()
	subset?: Asset[];
}

