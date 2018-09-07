import {
    AfterLoad, Column, CreateDateColumn, PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({type: 'timestamp with time zone'})
    createdDate?: Date;

    @UpdateDateColumn({type: 'timestamp with time zone'})
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
}
