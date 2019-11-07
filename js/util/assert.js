export const verify = function(
    condition,
    message = null,
    code = null,
    exception = null,
    kwargs = {}
) {
    if (condition) return;
    message = message || "Verification failed";
    const Exception = exception || Error;
    kwargs = Object.assign({}, kwargs);
    if (message !== null && message !== undefined) kwargs.message = message;
    if (code !== null && message !== undefined) kwargs.code = code;
    const throwable = new Exception(kwargs.message || undefined);
    throwable.kwargs = kwargs;
    for (const [key, value] of Object.entries(kwargs)) {
        if (throwable[key] !== undefined) continue;
        throwable[key] = value;
    }
    throw throwable;
};

export const verifyEqual = function(
    first,
    second,
    message = null,
    code = null,
    exception = null,
    kwargs = {}
) {
    message = message || `Expected ${first} got ${second}`;
    return this.verify(first === second, message, code, exception, kwargs);
};

export const verifyNotEqual = function(
    first,
    second,
    message = null,
    code = null,
    exception = null,
    kwargs = {}
) {
    message = message || `Expected ${first} not equal to ${second}`;
    return this.verify(first !== second, message, code, exception, kwargs);
};

export const verifyMany = function(
    sequence,
    message = null,
    code = null,
    exception = null,
    kwargs = {}
) {
    sequence.forEach(element => {
        verify(element, message, code, exception, kwargs);
    });
};

export default verify;
