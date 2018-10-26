import { Column, Entity } from 'typeorm';
import { Base } from './base';
import { enumerableColumnProperties } from '../util/helpers';
import { TaskExecutor } from './enums/task.enums';


@Entity()
export class Task extends Base {
    @Column({...enumerableColumnProperties, default: TaskExecutor.CLIENT})
    executor: TaskExecutor;

    @Column({type: 'text'})
    code: string;
}
