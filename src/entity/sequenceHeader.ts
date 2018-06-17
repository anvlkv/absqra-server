import { Column, Entity } from 'typeorm';
import { Base } from './base';
import { SequenceLifeCycleTypes } from './enums/sequence.enums';
import { enumerableColumnProperties } from '../util/helpers';


@Entity()
export class SequenceHeader extends Base {
    @Column({type: 'char', length: 256, default: 'new sequence', nullable: false})
    name: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;

    @Column({...enumerableColumnProperties, default: SequenceLifeCycleTypes.ONE_ONE})
    lifeCycle: SequenceLifeCycleTypes;
}
