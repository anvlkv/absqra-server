import { AfterLoad, Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, } from 'typeorm';
import { Asset } from './Asset';
import { FormatConstraint } from './FormatConstraint';
import { Base } from './base';
import { QuestionAsset } from './QuestionAsset';
import { ItemLifeCycleTypes, QuantityOrder } from './enums/item.enums';


@Entity()
export class Item extends Base {

    @Column({type: 'char', length: 256, nullable: true})
    name?: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;

    @OneToOne(type => QuestionAsset, {
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    question: QuestionAsset;

    @Column({type: 'char', length: 32, default: QuantityOrder.NONE})
    offers: QuantityOrder;

    @Column({type: 'char', length: 32, default: QuantityOrder.NONE})
    expects: QuantityOrder;

    @Column({type: 'char', length: 32, default: ItemLifeCycleTypes.ONE_ONE})
    lifeCycle: ItemLifeCycleTypes;

    @OneToMany(type => FormatConstraint, fc => fc.item, {
        cascade: true,
        eager: true,
    })
    @JoinTable({name: 'constraints_of_item'})
    formatConstraints?: FormatConstraint[];

    @OneToMany(type => Asset, asset => asset.item, {
        cascade: true,
        eager: true,
    })
    @JoinTable({name: 'assets_of_item'})
    assets?: Asset[];

    @AfterLoad()
    sortAssets?() {
        if (this.assets) {
            this.assets.sort((a1, a2) => a1.order - a2.order);
        }
    }
}

