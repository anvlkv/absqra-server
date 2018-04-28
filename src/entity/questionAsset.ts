import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AssetBase } from './assetBase';
import { Question } from './question';


@Entity()
export class QuestionAsset extends AssetBase {
    @ManyToOne(type => Question, question => question.questionOptions)
    @JoinColumn()
    question: Question;
}

