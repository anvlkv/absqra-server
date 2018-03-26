import { Column, Entity } from 'typeorm';
import { Base } from './base';


export class ResponseBody {
    source?: string;
    response: string | number | boolean;

    constructor(data: ResponseBody) {
        this.source = data.source;
        this.response = data.response;
    }
}

@Entity()
export class Response extends Base {
    @Column({type: 'json', nullable: true})
    body: ResponseBody[];
}
