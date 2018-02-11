import { AfterLoad, BeforeInsert, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
    @PrimaryGeneratedColumn()
    id?: number;

    // @CreateDateColumn({type: 'timestamp'})
    // createdDate?: Date;
    //
    // @UpdateDateColumn({type: 'timestamp'})
    // updatedDate?: Date;

    constructor(data?) {
        if (data) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        }
    }

    @AfterLoad()
    trimStrings?() {
        for (const k of Object.keys(this)) {
            if (typeof this[k] === 'string') {
                this[k] = <String>(this[k]).trim();
            }
        }
    }
}

export abstract class OrderableBase extends Base {
    @Column({type: 'integer'})
    order?: number;
}
