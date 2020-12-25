export declare class Model {
    static niw<T = Model>(this: { new(): T }): T
    static find<T = Model>(this: { new(): T }, params?: object): T[]
    static get<T = Model>(this: { new(): T }, params?: object): T

    constructor(options?: { fill?: boolean })
    apply<T = Model>(this: T, model: object): Promise<T>
    save<T = Model>(this: T): Promise<T>
    delete<T = Model>(this: T, options?: {
        preDelete?: boolean,
        postDelete?: boolean,
        beforeCallbacks?: Function[],
        afterCallbacks?: Function[]
    }): Promise<T>
    validate(): Promise<void>
    _validate(): IterableIterator<Error>
}

export declare class ModelStore extends Model {
    static get schema(): Record<string, unknown>
    static get idName(): string
}
