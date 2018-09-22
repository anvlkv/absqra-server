import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { AssetBase } from './assetBase';
import { Question } from './question/entity';


@Entity()
export class ResponseAsset extends AssetBase {
    @ManyToOne(type => Question, question => question.responseAssets)
    @JoinColumn()
    question: Question;
    @RelationId((responseAsset: ResponseAsset) => responseAsset.question)
    questionId?: number[];
}

