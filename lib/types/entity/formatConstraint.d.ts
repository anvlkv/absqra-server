import { Base } from './base';
import { META_VALUE_ValidationTypes, TYPE_ValidationTypes, ValidationTypes, VALUE_ValidationTypes } from './enums/formatConstraint.enums';
import { Question } from './question';
export declare class FormatConstraint extends Base {
    validationType: ValidationTypes;
    validationSubType: TYPE_ValidationTypes | VALUE_ValidationTypes | META_VALUE_ValidationTypes;
    stringConstraint?: string;
    numericConstraint?: number;
    booleanConstraint?: boolean;
    question: Question;
}
