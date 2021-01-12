export declare function eq<T>(
    valueC: T,
    message?: string
): (value?: T, ctx?: unknown) => boolean;

export declare function gt<T>(
    valueC: T,
    message?: string
): (value?: T, ctx?: unknown) => boolean;

export declare function gte<T>(
    valueC: T,
    message?: string
): (value?: T, ctx?: unknown) => boolean;

export declare function notEmpty(
    message?: string
): (value?: string | unknown[], ctx?: unknown) => boolean;

export declare function isIn<T>(
    valueC: T[],
    message?: string
): (value?: T, ctx?: unknown) => boolean;

export declare function isUpper(
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function isLower(
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function isSimple(
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function isEmail(
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function isUrl(
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function isRegex(
    regex: string,
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function stringGt(
    valueC: number,
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function stringLt(
    valueC: number,
    message?: string
): (value?: string, ctx?: unknown) => boolean;

export declare function stringEq(
    valueC: number,
    message?: string
): (value?: string, ctx?: unknown) => boolean;
