export const urlEncode = function(values) {
    // constructs the parts array that is going to
    // store the multiple and values
    const parts = [];

    // in case the provided value is not an array
    // then assumes it's an object and retrieve entries
    if (!Array.isArray(values)) {
        values = Object.entries(values);
    }

    // iterates over the complete set of pairs
    // available from the key value pairs to be
    // able to encode them properly
    values.forEach(([key, value]) => {
        const keyEncoded = encodeURIComponent(key);
        const valueEncoded = encodeURIComponent(value);
        parts.push(`${keyEncoded}=${valueEncoded}`);
    });

    // joins the complete set of parts with the and
    // separator and then returns the final string value
    return parts.join("&");
};

export default urlEncode;
