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

export default urlEncode;
