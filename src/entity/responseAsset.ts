import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AssetBase } from './assetBase';
import { Question } from './question';


@Entity()
export class ResponseAsset extends AssetBase {
    @ManyToOne(type => Question, question => question.responseOptions)
    @JoinColumn()
    question: Question;
}

