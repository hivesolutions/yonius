export declare class API {
    constructor(kwargs?: Record<string, unknown>)
    get(url: string, options?: APIOptions): unknown
    post(url: string, options?: APIOptions): unknown
    put(url: string, options?: APIOptions): unknown
    delete(url: string, options?: APIOptions): unknown
    patch(url: string, options?: APIOptions): unknown
    options(url: string, options?: APIOptions): unknown
}

type APIOptions = {
    params?: Record<string, unknown>,
    headers?: HeadersInit,
    kwargs?: Record<string, unknown>,
    handle?: boolean,
    data?: BodyInit | JSON,
    dataJ?: JSON,
    dataM?: unknown,
}
