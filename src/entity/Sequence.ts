import {
	AfterLoad, Column, CreateDateColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany,
	PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Step } from './Step';
import { Base } from './base';


@Entity({
	// orderBy: {
	// 	updatedDate: 'DESC',
	// }
})
export class Sequence extends Base {
	@Column({type: 'char', length: 256})
	name: string;

	@Column({type: 'char', length: 2000, nullable: true})
	description?: string;

	@OneToMany(type => Step, itemUSe => itemUSe.sequence, {
		cascade: true,
		eager: true
	})
	@JoinTable()
	steps: Step[];

	@AfterLoad()
	sortSteps() {
		this.steps.sort((s1, s2) => s1.order - s2.order);
	}
}
