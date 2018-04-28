export class ResponseBody {
    content?: string | number | boolean | ResponseBody[];
    isOriginal?: boolean;
    origin?: number | string;

    constructor(data: ResponseBody = {}) {
        this.content = data.content;
        this.isOriginal = data.isOriginal;
        this.origin = data.origin;
    }
}
