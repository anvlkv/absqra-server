import { OrderableBase } from './base';
import { AssetContentTypes, AssetTypes } from './enums/asset.enums';
export declare class AssetBase extends OrderableBase {
    assetType?: AssetTypes;
    contentType?: AssetContentTypes;
    content?: string;
    isGenerated?: boolean;
    origin?: number;
}
