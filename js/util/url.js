import { conf } from "./config";

/**
 * Encodes the multiple values as and encoded URI component, the
 * values can be wither defined as an array (order is preserved)
 * or as an object (where sequence order is not preserved).
 *
 * The value of each item can be either a primitive type or a sequence
 * in case it's of sequence the values are going to be encoded as
 * multiple parameters separated by the '&' character.
 *
 * @param {(Array|Object[])} values The values to be encoded as an
 * URI component (like GET params).
 * @returns {String} A string with the query encoded values.
 */
export const urlEncode = function(values) {
    // constructs the parts array that is going to
    // store the multiple and values
    const parts = [];

    // in case the provided value is not an array
    // then assumes it's an object and retrieve entries
    if (!Array.isArray(values)) {
        values = Object.entries(values);
    }

    // iterates over the complete set of pairs available
    // from the key value pairs to be able to encode them
    // properly, notice that the values themselves can be
    // sequences allowing multiple repetition of key
    values.forEach(([key, value]) => {
        if (!Array.isArray(value)) {
            value = [value];
        }
        const keyEncoded = encodeURIComponent(key);
        value.forEach(_value => {
            if (_value === undefined || _value === null) {
                return;
            }
            const valueEncoded = encodeURIComponent(_value);
            parts.push(`${keyEncoded}=${valueEncoded}`);
        });
    });

    // joins the complete set of parts with the and
    // separator and then returns the final string value
    return parts.join("&");
};

export const absoluteUrl = function(path, name = "BASE_URL", fallback = undefined) {
    const baseUrl = conf(name, fallback);
    if (!baseUrl) return null;
    return `${baseUrl}${path}`;
};

export default urlEncode;
