import { Column, Entity } from 'typeorm';
import { Base } from './base';
import { enumerableColumnProperties } from '../util/helpers';
import { TaskExecutorType } from './enums/task.enums';


@Entity()
export class Task extends Base {
    @Column({...enumerableColumnProperties, default: TaskExecutorType.CLIENT})
    executor: TaskExecutorType;

    @Column({type: 'text'})
    content: string;
}
