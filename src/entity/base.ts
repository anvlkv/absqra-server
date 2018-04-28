import {
    AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, EntitySchema, PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({type: 'timestamp without time zone'})
    createdDate?: Date;

    @UpdateDateColumn({type: 'timestamp without time zone'})
    updatedDate?: Date;

    constructor(data?: any, skipKeys: string[] = []) {
        skipKeys = ['id', 'createdDate', 'updatedDate', ...skipKeys];

        if (data) {
            for (const key in data) {
                if (data.hasOwnProperty(key)
                    && !this[key]
                    && skipKeys.indexOf(key) === -1) {
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
