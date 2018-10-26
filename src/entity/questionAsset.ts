import { AssetBase } from './assetBase';
import { Question } from './question/entity';
import { Entity, ManyToOne, RelationId } from 'typeorm';


@Entity()
export class QuestionAsset extends AssetBase {
    @ManyToOne(type => Question, question => question.questionAssets)
    question: Question;
    @RelationId((questionAsset: QuestionAsset) => questionAsset.question)
    questionId?: string;
}

