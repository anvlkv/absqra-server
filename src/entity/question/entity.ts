import { AfterLoad, Column, Entity, JoinTable, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Base } from '../base';
import { QuestionAsset } from '../questionAsset';
import { FormatConstraint } from '../formatConstraint';
import { QuantityOrder } from '../enums/item.enums';
import { ResponseAsset } from '../responseAsset';
import { QuestionContentAsset } from '../questionContentAsset';
import { enumerableColumnProperties } from '../../util/helpers';
import { QuestionTransformer } from './transform';
import { QuestionPresentationTypes } from '../enums/questionPresentationTypes.enums';


const rules = new QuestionTransformer().rules;

@Entity()
export class Question extends Base {

    @Column({type: 'varchar', length: 500, default: 'new question'})
    name?: string;

    @Column({type: 'text', nullable: true})
    description?: string;



    @ManyToOne(type => QuestionContentAsset, {
        cascade: true,
        eager: true
    })
    @JoinTable({
        name: 'question_contentAsset',
        joinColumn: {
            name: 'question',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'contentAsset',
            referencedColumnName: 'id'
        }
    })
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
    @JoinTable({
        name: 'question_formatConstraints',
        joinColumn: {
            name: 'question',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'formatConstraint',
            referencedColumnName: 'id'
        }
    })
    formatConstraints?: FormatConstraint[];
    @RelationId((question: Question) => question.formatConstraints)
    formatConstraintsIds?: string[];


    @OneToMany(type => QuestionAsset, qa => qa.question, {
        cascade: true
    })
    @JoinTable({
        name: 'question_questionAssets',
        joinColumn: {
            name: 'question',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'questionAsset',
            referencedColumnName: 'id'
        }
    })
    questionAssets?: QuestionAsset[];
    @RelationId((question: Question) => question.questionAssets)
    questionAssetsIds?: string[];


    @OneToMany(type => ResponseAsset, ra => ra.question, {
        cascade: true
    })
    @JoinTable({
        name: 'question_responseAsset',
        joinColumn: {
            name: 'question',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'responseAsset',
            referencedColumnName: 'id'
        }
    })
    responseAssets?: ResponseAsset[];
    @RelationId((question: Question) => question.responseAssets)
    responseAssetsIds?: string[];


    presentationType?: QuestionPresentationTypes;
    @AfterLoad()
    private async determinePresentationType?(next) {
        const question = this;
        question.presentationType = await new Promise<QuestionPresentationTypes>((resolve) => {
            rules.execute(question, (d) => {
                if (typeof d.presentationType === 'boolean') {
                    throw new Error(`no presentation type found for question [${question.id}]`)
                }
                resolve(<QuestionPresentationTypes>d.presentationType);
            });
        });

        return question;
    }


}
