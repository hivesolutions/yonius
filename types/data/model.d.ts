export declare class Model {
    static niw<T = Model>(this: { new (): T }): T;
    static find<T = Model>(this: { new (): T }, params?: Record<string, unknown>): T[];
    static get<T = Model>(this: { new (): T }, params?: Record<string, unknown>): T;

    constructor(options?: { fill?: boolean });
    apply<T = Model>(this: T, model: Record<string, unknown>): Promise<T>;
    save<T = Model>(this: T): Promise<T>;
    delete<T = Model>(
        this: T,
        options?: {
            preDelete?: boolean;
            postDelete?: boolean;
            beforeCallbacks?: ((self: T, model: Record<string, unknown>) => void)[];
            afterCallbacks?: ((self: T, model: Record<string, unknown>) => void)[];
        }
    ): Promise<T>;

    reload<T = Model>(this: T, params?: Record<string, unknown>): Promise<T>;

    validate(): Promise<void>;
    _validate(): IterableIterator<Error>;
}

export declare class ModelStore extends Model {
    static get schema(): Record<string, unknown>;
    static get idName(): string;
}
