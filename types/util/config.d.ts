export enum Cast {
    int = "int",
    float = "float",
    bool = "bool",
    list = "list",
    tuple = "tuple"
}
export declare function load(
    names?: string[],
    path?: string,
    encoding?: string,
    force?: boolean,
    ctx?: unknown
): Promise<void>;
export declare function conf(
    name: string,
    fallback?: unknown,
    cast?: string,
    ctx?: unknown
): unknown;
export declare function confP(
    name: string,
    fallback?: unknown,
    cast?: Cast | string,
    ctx?: unknown
): Promise<unknown>;
