import { Column, Entity } from 'typeorm';
import { Base } from './base';
import { SequenceLifeCycleTypes } from './enums/sequence.enums';
import { enumerableColumnProperties } from '../util/helpers';


@Entity()
export class SequenceHeader extends Base {
    @Column({type: 'varchar', length: 500, default: 'new sequence', nullable: false})
    name: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({...enumerableColumnProperties, default: SequenceLifeCycleTypes.ONE_ONE})
    lifeCycle: SequenceLifeCycleTypes;
}
