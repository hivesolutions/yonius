export declare class Model {
    static niw<T = Model>(this: { new(): T }): T
    static find<T = Model>(this: { new(): T }, params?: Record<string, any>): T[]
    static get<T = Model>(this: { new(): T }, params?: Record<string, any>): T

    constructor(options?: { fill?: boolean })
    apply<T = Model>(this: T, model: Record<string, any>): Promise<T>
    save<T = Model>(this: T): Promise<T>
    delete<T = Model>(this: T, options?: {
        preDelete?: boolean,
        postDelete?: boolean,
        beforeCallbacks?: ((self: T, model: Record<string, any>) => void)[],
        afterCallbacks?: ((self: T, model: Record<string, any>) => void)[]
    }): Promise<T>

    validate(): Promise<void>
    _validate(): IterableIterator<Error>
}

export declare class ModelStore extends Model {
    static get schema(): Record<string, unknown>
    static get idName(): string
}
