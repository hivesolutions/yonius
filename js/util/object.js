export const equal = function(first, second) {
    if (first === second) {
        return true;
    }

    if (typeof_(first) !== typeof_(second)) {
        return false;
    }

    if (isPrimitive(first) && isPrimitive(second)) {
        return first === second;
    }

    if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
    }

    for (const key in first) {
        if (!(key in second)) return false;
        if (!equal(first[key], second[key])) return false;
    }

    return true;
};

export const isPrimitive = function(object) {
    return object !== Object(object);
};

export const typeof_ = function(object) {
    if (object === null) return "null";
    if (Array.isArray(object)) return "array";
    return typeof object;
};

export default equal;
