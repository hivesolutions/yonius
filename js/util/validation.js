import { ValidationError } from "../base/error";

export const eq = function(valueC, message = "Must be equal to %{1}") {
    const validation = (value, ctx) => {
        if (value === null) return true;
        if (value === valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const gt = function(valueC, message = "Must be greater than %{1}") {
    const validation = (value, ctx) => {
        if (value === null) return true;
        if (value > valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};

export const notEmpty = function(valueC, message = "Value is empty") {
    const validation = (value, ctx) => {
        if (value === null) return true;
        if (value.length) return true;
        throw new ValidationError(message);
    };
    return validation;
};

export const isIn = function(valueC, message = "Value must be one of %{1}") {
    const validation = (value, ctx) => {
        if (value === null) return true;
        if (valueC.includes(value)) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};
