import { ValidationError } from "../base/error";

export const eq = function(valueC, message = "Must be equal to %{1}") {
    const validation = (value, ctx) => {
        if (value === null) return true;
        if (value === valueC) return true;
        throw new ValidationError(message.replace("%{1}", String(valueC)));
    };
    return validation;
};
