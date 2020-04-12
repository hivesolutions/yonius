export const camelToUnderscore = function(value, separator = "_") {
    if (!value) return value;
    return value
        .replace(/\.?([A-Z])/g, (x, y) => separator + y.toLowerCase())
        .replace(RegExp("^" + separator), "");
};
