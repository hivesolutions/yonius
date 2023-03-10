export declare class YoniusError extends Error {
    name: string;
    message: string;
    code: number;
    stack?: string;
    cause?: unknown;
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
