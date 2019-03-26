export const verify = function(
    condition,
    message = null,
    code = null,
    exception = null,
    ...kwargs
) {
    if (condition) return;
    const Exception = exception || Error;
    kwargs = Object.assign({}, kwargs);
    if (message !== null && message !== undefined) kwargs.message = message;
    if (code !== null && message !== undefined) kwargs.code = code;
    throw new Exception(...kwargs);
};

export const verifyMany = function(
    sequence,
    message = null,
    code = null,
    exception = null,
    ...kwargs
) {
    sequence.forEach(element => {
        verify(element, message, code, exception, ...kwargs);
    });
};

export default verify;
