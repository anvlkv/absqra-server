import { Column } from 'typeorm';
import { AssetContentTypes, AssetTypes } from './enums/asset.enums';
import { OrderableBase } from './orderableBase';
import { enumerableColumnProperties } from '../util/helpers';


export class AssetBase extends OrderableBase {
    @Column({...enumerableColumnProperties, default: AssetTypes.STATIC})
    assetType?: AssetTypes;

    @Column({...enumerableColumnProperties, default: AssetContentTypes.TEXT})
    contentType?: AssetContentTypes;

    @Column({type: 'text', nullable: true})
    content?: string;

    isGenerated?: boolean;
    origin?: number;
}

