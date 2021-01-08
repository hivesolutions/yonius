export declare class API {
    constructor(kwargs?: Record<string, unknown>)
    get(url: string, options?: Record<string, unknown>): any
    post(url: string, options?: Record<string, unknown>): any
    put(url: string, options?: Record<string, unknown>): any
    delete(url: string, options?: Record<string, unknown>): any
    patch(url: string, options?: Record<string, unknown>): any
    options(url: string, options?: Record<string, unknown>): any
}
