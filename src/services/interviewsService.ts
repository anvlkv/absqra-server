import { DataService } from './dataService';
import {Inject} from 'typescript-ioc';


export class InterviewsService {
    private dataService:DataService;

    constructor(
    ){
        this.dataService = new DataService();
    }

    public async sequencesList(ctx, next) {
        ctx.body = await this.dataService.connection.model('Sequence').find();
        next();
    }
}