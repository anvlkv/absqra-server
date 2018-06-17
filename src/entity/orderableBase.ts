import { Column } from 'typeorm';
import { Base } from './base';


export abstract class OrderableBase extends Base {
    @Column({type: 'integer', default: 0})
    order?: number;
}
