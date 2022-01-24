export const camelToUnderscore = function(value, separator = "_") {
    if (!value) return value;
    return value
        .replace(/\.?([A-Z])/g, (x, y) => separator + y.toLowerCase())
        .replace(RegExp("^" + separator), "");
};

export const underscoreToCamel = function(value, lower = false, separator = "_") {
    if (!value) return value;
    const slices = value.split(separator);
    return slices
        .map((s, i) => {
            if (i === 0 && lower) return s.charAt(0).toLowerCase() + s.slice(1);
            return s.charAt(0).toUpperCase() + s.slice(1);
        })
        .join("");
};
