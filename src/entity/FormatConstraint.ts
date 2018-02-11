import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Item } from './Item';
import { META_VALUE_ValidationTypes, TYPE_ValidationTypes, ValidationTypes, VALUE_ValidationTypes } from './enums/formatConstraint.enums';


@Entity()
export class FormatConstraint extends Base {

    @Column({type: 'char', length: 32, default: ValidationTypes.META_VALUE})
    validationType: ValidationTypes;

    @Column({type: 'char', length: 32, default: META_VALUE_ValidationTypes.EXISTS})
    validationSubType: TYPE_ValidationTypes | VALUE_ValidationTypes | META_VALUE_ValidationTypes;

    @Column({type: 'char', length: 500, nullable: true})
    stringConstraint?: string;

    @Column({type: 'numeric', nullable: true})
    numericConstraint?: number;

    @Column({type: 'boolean', nullable: true})
    booleanConstraint?: boolean;

    @ManyToOne(type => Item, item => item.formatConstraints)
    item?: Item;
}
