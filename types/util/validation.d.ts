export declare function eq(
    valueC: unknown,
    message?: string
): (value?: unknown, ctx?: any) => boolean;

export declare function gt(
    valueC: unknown,
    message?: string
): (value?: unknown, ctx?: any) => boolean;

export declare function notEmpty(
    message?: string
): (value?: string | unknown[], ctx?: any) => boolean;

export declare function isIn(
    valueC: unknown[],
    message?: string
): (value?: unknown, ctx?: any) => boolean;

export declare function isSimple(
    message?: string
): (value?: string, ctx?: any) => boolean;

export declare function isEmail(
    message?: string
): (value?: string, ctx?: any) => boolean;

export declare function isUrl(
    message?: string
): (value?: string, ctx?: any) => boolean;

export declare function isRegex(
    regex: string,
    message?: string
): (value?: string, ctx?: any) => boolean;
