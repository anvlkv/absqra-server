import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { AssetBase } from './assetBase';
import { Question } from './question';


@Entity()
export class ResponseAsset extends AssetBase {
    @ManyToOne(type => Question, question => question.responseAssets)
    question: Question;
    @RelationId((responseAsset: ResponseAsset) => responseAsset.question)
    questionId?: string;
}

