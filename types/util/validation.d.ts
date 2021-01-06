export declare function eq<T>(
    valueC: T,
    message?: string
): (value?: T, ctx?: any) => boolean;

export declare function gt<T>(
    valueC: T,
    message?: string
): (value?: T, ctx?: any) => boolean;

export declare function notEmpty(
    message?: string
): (value?: string | unknown[], ctx?: any) => boolean;

export declare function isIn<T>(
    valueC: T[],
    message?: string
): (value?: T, ctx?: any) => boolean;

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
