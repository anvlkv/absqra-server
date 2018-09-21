import { Column, Entity, JoinTable, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Base } from './base';
import { QuestionAsset } from './questionAsset';
import { FormatConstraint } from './formatConstraint';
import { QuantityOrder } from './enums/item.enums';
import { ResponseAsset } from './responseAsset';
import { QuestionContentAsset } from './questionContentAsset';
import { enumerableColumnProperties } from '../util/helpers';

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
    formatConstraintsIds?: number[];


    @OneToMany(type => QuestionAsset, qa => qa.question, {
        cascade: true
    })
    @JoinTable()
    questionAssets?: QuestionAsset[];
    @RelationId((question: Question) => question.questionAssets)
    questionAssetsIds?: number[];


    @OneToMany(type => ResponseAsset, ra => ra.question, {
        cascade: true
    })
    @JoinTable()
    responseAssets?: ResponseAsset[];
    @RelationId((question: Question) => question.responseAssets)
    responseAssetsIds?: number[];
}
