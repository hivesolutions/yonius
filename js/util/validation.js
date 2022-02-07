import { ValidationError } from "../base/error";

/**
 * The simple regex used to validate
 * if the provided value is a "simple" one meaning
 * that it may be used safely for URL parts
 */
const SIMPLE_REGEX = /^[\:\.\s\w-]+$/;

/**
 * The email regex used to validate
 * if the provided value is in fact an email
 */
const EMAIL_REGEX = /^[\w\d\._%+-]+@[\w\d\.\-]+$/;

/**
 * The URL regex used to validate
 * if the provided value is in fact an URL/URI
 */
const URL_REGEX = /^\w+\:\/\/([^@]+\:[^@]+@)?[^\:\/\?#]+(\:\d+)?(\/[^\?#]+)*\/?(\?[^#]*)?(#.*)?$/;

export const eq = function(valueC, message = "Must be equal to %{1}") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const gt = function(valueC, message = "Must be greater than %{1}") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value > valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const gte = function(valueC, message = "Must be greater than or equal to %{1}") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value >= valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const notEmpty = function(message = "Value is empty") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value.length) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isIn = function(valueC, message = "Value must be one of: %{1}") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (valueC.includes(value)) return true;
        throw new ValidationError(message.replace("%{1}", valueC.join(", ")));
    };
    return validation;
};

export const isUpper = function(message = "Value contains lower cased characters") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === "") return true;
        if (value === value.toUpperCase()) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isLower = function(message = "Value contains upper cased characters") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === "") return true;
        if (value === value.toLowerCase()) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isSimple = function(message = "Value contains invalid characters") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === "") return true;
        if (value.match(SIMPLE_REGEX)) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isEmail = function(message = "Value is not a valid email") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === "") return true;
        if (value.match(EMAIL_REGEX)) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isUrl = function(message = "Value is not a valid URL") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === "") return true;
        if (value.match(URL_REGEX)) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isRegex = function(regex, message = "Value has incorrect format") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === "") return true;
        if (value.match(new RegExp(regex))) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const stringGt = function(valueC, message = "Must be larger than %{1} characters") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value.length > valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const stringLt = function(valueC, message = "Must be smaller than %{1} characters") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value.length < valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const stringEq = function(valueC, message = "Must be exactly %{1} characters") {
    const validation = (value, ctx) => {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value.length === valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const all = function(validation) {
    const _validation = (sequence, ctx) => {
        if (sequence === undefined) return true;
        if (sequence === null) return true;
        for (const value of sequence) {
            validation(value, ctx);
        }
        return true;
    };
    return _validation;
};
