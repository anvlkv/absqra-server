import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId, TreeChildren, TreeParent } from 'typeorm';
import { Base } from './base';
import { enumerableColumnProperties } from '../util/helpers';
import { LogicTypes } from './enums/logic.enums';
import { Step } from './step';
import { FormatConstraint } from './formatConstraint';

@Entity()
export class Logic extends Base {
    @Column({...enumerableColumnProperties, default: LogicTypes.SKIP, nullable: true})
    type: LogicTypes;


    @ManyToOne(type => Step)
    @JoinColumn()
    sourceStep?: Step;
    @RelationId((logic: Logic) => logic.destinationStep)
    sourceStepId?: string;


    @ManyToOne(type => Step)
    @JoinColumn()
    destinationStep?: Step;
    @RelationId((logic: Logic) => logic.destinationStep)
    destinationStepId?: string;


    @OneToMany(type => FormatConstraint, fc => fc.logic, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    formatConstraints?: FormatConstraint[];
    @RelationId((logic: Logic) => logic.formatConstraints)
    formatConstraintsIds?: string[];


    @TreeParent()
    parent?: Logic;
    @TreeChildren({
        cascade: true
    })
    alternatives?: Logic[];
    @RelationId((logic: Logic) => logic.parent)
    parentId?: string;
    @RelationId((logic: Logic) => logic.alternatives)
    alternativesIds?: string[];
}
