import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderableBase } from './base';
import { AssetContentTypes, AssetTypes } from './enums/asset.enums';


export class AssetBase extends OrderableBase {
    @Column({type: 'char', length: 32, default: AssetTypes.STATIC})
    assetType?: AssetTypes;

    @Column({type: 'char', length: 32, default: AssetContentTypes.TEXT})
    contentType?: AssetContentTypes;

    @Column({type: 'char', length: 2000, nullable: true})
    content?: string;

    isGenerated?: boolean;
    origin?: number;
}

