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
    @Column({type: 'char', length: 256, nullable: true})
    name?: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;



    @ManyToOne(type => QuestionContentAsset, {
        cascade: true
    })
    @JoinTable()
    content: QuestionContentAsset;
    @RelationId((question: Question) => question.content)
    contentId?: number;



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
    questionOptions?: QuestionAsset[];
    @RelationId((question: Question) => question.questionOptions)
    questionOptionsIds?: number[];


    @OneToMany(type => ResponseAsset, ra => ra.question, {
        cascade: true
    })
    @JoinTable()
    responseOptions?: ResponseAsset[];
    @RelationId((question: Question) => question.responseOptions)
    responseOptionsIds?: number[];
}
