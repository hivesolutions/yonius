const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

export const escapeStringRegexp = function(string) {
    if (typeof string !== "string") {
        throw new TypeError("Expected a string");
    }

    return string.replace(matchOperatorsRegex, "\\$&");
};
