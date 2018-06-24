import { AssetContentTypes, AssetTypes } from './enums/asset.enums';
import { OrderableBase } from './orderableBase';
export declare class AssetBase extends OrderableBase {
    assetType?: AssetTypes;
    contentType?: AssetContentTypes;
    content?: string;
    isGenerated?: boolean;
    origin?: number;
}
