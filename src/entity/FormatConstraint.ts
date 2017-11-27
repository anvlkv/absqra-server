import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';


export enum ValidationTypes {
	TYPE = 'type',
	VALUE = 'value',
	META_VALUE = 'meta_value'
}

export enum TYPE_ValidationTypes {
	IS_TEXT = 'text',
	IS_NUMBER = 'number',
	IS_EMAIL = 'email',
	IS_URL = 'url',
	IS_FILE = 'file'
}

export enum VALUE_ValidationTypes {
	MIN = 'min',
	MAX = 'max',
	CONTAINS = 'contains',
	NOT_CONTAINS = 'not_contains'
}

export enum META_VALUE_ValidationTypes {
	VALUES_COUNT = 'values_count',
	STRING_LENGTH = 'value_length'
}

@Entity()
export class FormatConstraint extends Base {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({type: 'char', length: 32})
	validationType: ValidationTypes;

	@Column({type: 'char', length: 32})
	validationSubType: TYPE_ValidationTypes | VALUE_ValidationTypes | META_VALUE_ValidationTypes;

	@Column({type: 'char', length: 500, nullable: true})
	stringConstraint?: string;

	@Column({type: 'numeric', nullable: true})
	numericConstraint?: number;

	@Column({type: 'boolean', nullable: true})
	booleanConstraint?: boolean;
}
