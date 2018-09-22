import * as RuleEngine from 'node-rules';
import { Question } from './entity';
import { QuantityOrder } from '..';


export class QuestionTransformer {
    public rules: RuleEngine;
    // rule = {
    //     'condition': function (R) {
    //         this.rules.when(this.transactionTotal < 500);
    //     },
    //     'consequence': function (R) {
    //         this.result = false;
    //         this.reason = 'The transaction was blocked as it was less than 500';
    //         R.stop();
    //     }
    // };

    constructor() {
        this.rules = new RuleEngine();
        this.rules.register({
            'name': 'display static',
            'condition': function (this: Question, R) {
                R.when(this.expects.trim() === QuantityOrder.NONE &&
                    this.offers.trim() === QuantityOrder.NONE);
            },
            'consequence': function (R) {
                this.result = 'static';
                R.stop();
            }
        });
    }

}
