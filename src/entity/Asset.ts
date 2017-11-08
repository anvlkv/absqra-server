import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { Item } from './Item';

export enum AssetTypes {
    STATIC = 'static',
    DYNAMIC = 'dynamic'
}

export enum AssetContentTypes {
    TEXT = 'text',
    FILE = 'file',
    URL = 'url',
    INT_SEQUENCE = 'internal:sequence',
    INT_ITEM = 'internal:item'
}


@Entity()
export class Asset {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'char', length: 32, default: AssetTypes.STATIC})
    assetType: AssetTypes;

    @Column({type: 'char', length: 32, default: AssetContentTypes.TEXT})
    contentType: AssetContentTypes;

    @Column({type: 'char', length: 2000, nullable: true})
    content: string;

    @ManyToOne(type => Item)
    @JoinTable()
    questionOf: Item;
}

