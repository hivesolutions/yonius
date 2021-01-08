export declare class API {
    constructor(kwargs?: Record<string, unknown>)
    get(url: string, options?: Record<string, unknown>): unknown
    post(url: string, options?: Record<string, unknown>): unknown
    put(url: string, options?: Record<string, unknown>): unknown
    delete(url: string, options?: Record<string, unknown>): unknown
    patch(url: string, options?: Record<string, unknown>): unknown
    options(url: string, options?: Record<string, unknown>): unknown
}
