import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base';
import { META_VALUE_ValidationTypes, TYPE_ValidationTypes, ValidationTypes, VALUE_ValidationTypes } from './enums/formatConstraint.enums';
import { Question } from './question/entity';
import { enumerableColumnProperties } from '../util/helpers';


@Entity()
export class FormatConstraint extends Base {

    @Column({...enumerableColumnProperties, default: ValidationTypes.META_VALUE})
    validationType: ValidationTypes;

    @Column({...enumerableColumnProperties, default: META_VALUE_ValidationTypes.EXISTS})
    validationSubType: TYPE_ValidationTypes | VALUE_ValidationTypes | META_VALUE_ValidationTypes;

    @Column({type: 'char', length: 500, nullable: true})
    stringConstraint?: string;

    @Column({type: 'numeric', nullable: true})
    numericConstraint?: number;

    @Column({type: 'boolean', nullable: true})
    booleanConstraint?: boolean;

    @ManyToOne(type => Question, question => question.formatConstraints)
    question: Question;
}
