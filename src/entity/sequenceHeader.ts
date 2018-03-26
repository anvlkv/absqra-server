import { Column, Entity } from 'typeorm';
import { Base } from './base';


@Entity()
export class SequenceHeader extends Base {
    @Column({type: 'char', length: 256})
    name: string;

    @Column({type: 'char', length: 2000, nullable: true})
    description?: string;
}
