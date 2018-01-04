import { Column, Entity } from 'typeorm';
import { Base } from './base';
import { Asset } from './Asset';

export interface ResponseBody {
	source?: string;
	response: string | number | boolean;
}

@Entity()
export class Response extends Base {
	@Column({type: 'json', nullable: true})
	body: ResponseBody[];
}
