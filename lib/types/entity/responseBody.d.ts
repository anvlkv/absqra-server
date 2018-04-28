export declare class ResponseBody {
    content?: string | number | boolean | ResponseBody[];
    isOriginal?: boolean;
    origin?: number | string;
    constructor(data?: ResponseBody);
}
