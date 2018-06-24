import { Base } from './base';
import { QuestionAsset } from './questionAsset';
import { FormatConstraint } from './formatConstraint';
import { QuantityOrder } from './enums/item.enums';
import { ResponseAsset } from './responseAsset';
import { QuestionContentAsset } from './questionContentAsset';
export declare class Question extends Base {
    name?: string;
    description?: string;
    content: QuestionContentAsset;
    contentId?: number;
    offers: QuantityOrder;
    expects: QuantityOrder;
    formatConstraints?: FormatConstraint[];
    formatConstraintsIds?: number[];
    questionOptions?: QuestionAsset[];
    questionOptionsIds?: number[];
    responseOptions?: ResponseAsset[];
    responseOptionsIds?: number[];
}
