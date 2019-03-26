export const urlEncode = function(values) {
    const parts = [];

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

    return parts.join("&");
};

export default urlEncode;
