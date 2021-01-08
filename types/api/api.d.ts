export declare class API {
    constructor(kwargs?: Record<string, unknown>)
    async get(url: string, options?: Record<string, unknown>): any
    async post(url: string, options?: Record<string, unknown>): any
    async put(url: string, options?: Record<string, unknown>): any
    async delete(url: string, options?: Record<string, unknown>): any
    async patch(url: string, options?: Record<string, unknown>): any
    async options(url: string, options?: Record<string, unknown>): any
}
