export declare abstract class Base {
    id?: number;
    createdDate?: Date;
    updatedDate?: Date;
    constructor(data?: any, skipKeys?: string[]);
    trimStrings?(): void;
}
export declare abstract class OrderableBase extends Base {
    order?: number;
}
