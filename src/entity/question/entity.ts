import { AfterLoad, Column, Entity, JoinTable, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Base } from '../base';
import { QuestionAsset } from '../questionAsset';
import { FormatConstraint } from '../formatConstraint';
import { QuantityOrder } from '../enums/item.enums';
import { ResponseAsset } from '../responseAsset';
import { QuestionContentAsset } from '../questionContentAsset';
import { enumerableColumnProperties } from '../../util/helpers';
import { QuestionTransformer } from './transform';


const rules = new QuestionTransformer().rules;

@Entity()
export class Question extends Base {

    @Column({type: 'char', length: 256, default: 'new question'})
    name?: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;



    @ManyToOne(type => QuestionContentAsset, {
        cascade: true,
        eager: true
    })
    @JoinTable()
    contentAsset: QuestionContentAsset;
    @RelationId((question: Question) => question.contentAsset)
    contentAssetId?: number;



    @Column({...enumerableColumnProperties, default: QuantityOrder.NONE})
    offers: QuantityOrder;

    @Column({...enumerableColumnProperties, default: QuantityOrder.NONE})
    expects: QuantityOrder;

    @OneToMany(type => FormatConstraint, fc => fc.question, {
        cascade: true
    })
    @JoinTable()
    formatConstraints?: FormatConstraint[];
    @RelationId((question: Question) => question.formatConstraints)
    formatConstraintsIds?: string[];


    @OneToMany(type => QuestionAsset, qa => qa.question, {
        cascade: true
    })
    @JoinTable()
    questionAssets?: QuestionAsset[];
    @RelationId((question: Question) => question.questionAssets)
    questionAssetsIds?: string[];


    @OneToMany(type => ResponseAsset, ra => ra.question, {
        cascade: true
    })
    @JoinTable()
    responseAssets?: ResponseAsset[];
    @RelationId((question: Question) => question.responseAssets)
    responseAssetsIds?: string[];


    visualization?: string;
    @AfterLoad()
    private async determineClientComponent?(next) {
        const question = this;
        question.visualization = await new Promise<string>((resolve) => {
            rules.execute(question, (d) => {
                resolve(d.result);
            });
        });
        return question;
    }
}
