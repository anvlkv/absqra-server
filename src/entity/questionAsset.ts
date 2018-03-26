import { Column, Entity } from 'typeorm';
import { Base } from './base';
import { AssetContentTypes, AssetTypes } from './enums/asset.enums';


@Entity()
export class QuestionAsset extends Base {
    @Column({type: 'char', length: 32, default: AssetTypes.STATIC})
    assetType: AssetTypes;

    @Column({type: 'char', length: 32, default: AssetContentTypes.TEXT})
    contentType: AssetContentTypes;

    @Column({type: 'char', length: 2000, nullable: true})
    content?: string;
}
