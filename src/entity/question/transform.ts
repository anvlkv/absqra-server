import * as RuleEngine from 'node-rules';
import { Question } from './entity';
import { FormatConstraint, META_VALUE_ValidationTypes, QuantityOrder, QuestionPresentationTypes, ValidationTypes } from '..';


export class QuestionTransformer {
    public rules: RuleEngine;

    displayStaticContent = {
        'condition': function (this: Question, R) {
            R.when(this.expects === QuantityOrder.NONE &&
                this.offers === QuantityOrder.NONE);
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.STATIC;
            R.stop();
        }
    };

    displayRadioButtons = {
        'condition': function (this: Question, R) {
            R.when(this.expects === QuantityOrder.ONE &&
                this.offers === QuantityOrder.MULTIPLE);
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.RADIO_BUTTONS;
            R.stop();
        }
    };

    displayCheckboxes = {
        'condition': function (this: Question, R) {
            R.when(this.expects === QuantityOrder.MULTIPLE &&
                this.offers === QuantityOrder.MULTIPLE);
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.CHECK_BOXES;
            R.stop();
        }
    };

    displayLargeTextInput = {
        'condition': function (this: Question, R) {
            const linLengthFc = getFormatConstraintsWhere(this, fc => fc.validationType === ValidationTypes.META_VALUE &&
                fc.validationSubType === META_VALUE_ValidationTypes.STRING_LENGTH);

            R.when(this.expects === QuantityOrder.ONE &&
                this.offers === QuantityOrder.NONE && linLengthFc.some(fc => fc.numericConstraint > 100));
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.LARGE_TEXT;
            R.stop();
        }
    };

    displayInput = {
        'condition': function (this: Question, R) {
            const linLengthFc = getFormatConstraintsWhere(this, fc => fc.validationType === ValidationTypes.META_VALUE &&
                fc.validationSubType === META_VALUE_ValidationTypes.STRING_LENGTH);

            R.when(this.expects === QuantityOrder.ONE &&
                this.offers === QuantityOrder.NONE &&
                (!linLengthFc.some(fc => fc.numericConstraint > 100))
            );
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.INPUT;
            R.stop();
        }
    };

    displayListInput = {
        'condition': function (this: Question, R) {
            R.when(this.expects === QuantityOrder.MULTIPLE &&
                this.offers === QuantityOrder.NONE);
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.LIST_INPUT;
            R.stop();
        }
    };

    displayYesNo = {
        'condition': function (this: Question, R) {
            R.when(this.expects === QuantityOrder.ONE &&
                this.offers === QuantityOrder.ONE);
        },
        'consequence': function (this: Question, R) {
            this.presentationType = QuestionPresentationTypes.YES_NO;
            R.stop();
        }
    };

    constructor() {
        this.rules = new RuleEngine();
        this.rules.register(this.displayStaticContent);
        this.rules.register(this.displayRadioButtons);
        this.rules.register(this.displayCheckboxes);
        this.rules.register(this.displayLargeTextInput);
        this.rules.register(this.displayInput);
        this.rules.register(this.displayListInput);
        this.rules.register(this.displayYesNo);

    }


}
function getFormatConstraintsWhere(question: Question, condition: (fc: FormatConstraint) => boolean ) {
    return question.formatConstraints ? question.formatConstraints.filter(condition) : [];
}
