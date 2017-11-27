import { AfterLoad, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
	@AfterLoad()
	trimStrings?() {
		for (const k of Object.keys(this)) {
			if (typeof this[k] === 'string') {
				this[k] = <String>(this[k]).trim();
			}
		}
	}

	@PrimaryGeneratedColumn()
	id?: number;

	@CreateDateColumn({type: 'timestamp'})
	createdDate?: Date;

	@UpdateDateColumn({type: 'timestamp'})
	updatedDate?: Date;
}
