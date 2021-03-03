export interface QueryParams {
    readonly fields?: string[];
    readonly eager?: boolean;
    readonly eagerL?: boolean;
    readonly map?: boolean;
    readonly rules?: boolean;
    readonly meta?: boolean;
    readonly build?: boolean;
    readonly fill?: boolean;
    readonly resolveA?: boolean;
    readonly skip?: number;
    readonly limit?: number;
    readonly sort?: unknown[][];
    readonly raiseE?: boolean;
    [x: string]: unknown;
}

export declare class Model {
    static niw<T = Model>(this: { new (): T }): T;
    static find<T = Model>(this: { new (): T }, params?: QueryParams): Promise<T[]>;
    static get<T = Model>(this: { new (): T }, params?: QueryParams): Promise<T>;

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

    reload<T = Model>(this: T, params?: QueryParams): Promise<T>;

    validate(): Promise<void>;
    _validate(): IterableIterator<Error>;
}

export declare class ModelStore extends Model {
    static get schema(): Record<string, unknown>;
    static get idName(): string;
    preSave(): Promise<void>;
    preCreate(): Promise<void>;
    preUpdate(): Promise<void>;
    preDelete(): Promise<void>;
    postSave(): Promise<void>;
    postCreate(): Promise<void>;
    postUpdate(): Promise<void>;
    postDelete(): Promise<void>;
}
