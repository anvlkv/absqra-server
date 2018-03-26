import { Column, Entity } from 'typeorm';
import { Base } from './base';


@Entity()
export class Respondent extends Base {
    @Column({type: 'char', length: 256})
    name?: string;
}
