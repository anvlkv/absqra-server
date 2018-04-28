import { Base } from './base';
import { QuestionAsset } from './questionAsset';
import { FormatConstraint } from './formatConstraint';
import { ItemLifeCycleTypes, QuantityOrder } from './enums/item.enums';
import { ResponseAsset } from './responseAsset';
import { QuestionContentAsset } from './questionContentAsset';
export declare class Question extends Base {
    name?: string;
    description?: string;
    content: QuestionContentAsset;
    offers: QuantityOrder;
    expects: QuantityOrder;
    lifeCycle: ItemLifeCycleTypes;
    formatConstraints?: FormatConstraint[];
    questionOptions?: QuestionAsset[];
    responseOptions?: ResponseAsset[];
}
