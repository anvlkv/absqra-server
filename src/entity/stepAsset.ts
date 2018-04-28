import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AssetBase } from './assetBase';
import { Question } from './question';
import { Step } from './step';


@Entity()
export class StepAsset extends AssetBase {

}

