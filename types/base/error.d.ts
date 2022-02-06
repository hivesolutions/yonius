export declare class YoniusError extends Error {
    code: number;
    constructor(message: string, code?: number);
    isClient(): boolean;
    isServer(): boolean;
}

export declare class OperationalError extends YoniusError {
    constructor(message?: string, code?: number);
}

export declare class NotFoundError extends OperationalError {}

export declare class NotImplementedError extends OperationalError {}

export declare class ValidationError extends OperationalError {}
