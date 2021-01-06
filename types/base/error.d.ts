export declare class YoniusError {
    constructor(message: string, code?: number)
    isClient() : Boolean
    isServer() : Boolean
}

export declare class OperationalError extends YoniusError {
    constructor(message?: string, code?: number)
}

export declare class NotFoundError extends OperationalError {
    constructor(message?: string, code?: number)
}

export declare class NotImplementedError extends OperationalError {
    constructor(message?: string, code?: number)
}

export declare class ValidationError extends OperationalError {
    constructor(message?: string, code?: number)
}
