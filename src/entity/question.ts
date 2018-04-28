import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base';
import { QuestionAsset } from './questionAsset';
import { FormatConstraint } from './formatConstraint';
import { ItemLifeCycleTypes, QuantityOrder } from './enums/item.enums';
import { ResponseAsset } from './responseAsset';
import { QuestionContentAsset } from './questionContentAsset';

@Entity()
export class Question extends Base {
    @Column({type: 'char', length: 256, nullable: true})
    name?: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;

    @ManyToOne(type => QuestionContentAsset, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    content: QuestionContentAsset;

    @Column({type: 'char', length: 32, default: QuantityOrder.NONE})
    offers: QuantityOrder;

    @Column({type: 'char', length: 32, default: QuantityOrder.NONE})
    expects: QuantityOrder;

    @Column({type: 'char', length: 32, default: ItemLifeCycleTypes.ONE_ONE})
    lifeCycle: ItemLifeCycleTypes;

    @OneToMany(type => FormatConstraint, fc => fc.question, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    formatConstraints?: FormatConstraint[];

    @OneToMany(type => QuestionAsset, qa => qa.question, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    questionOptions?: QuestionAsset[];

    @OneToMany(type => ResponseAsset, ra => ra.question, {
        cascade: true,
        eager: true,
    })
    @JoinTable()
    responseOptions?: ResponseAsset[];
}
