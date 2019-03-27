const CASTS = {
    int: v => (typeof v === "number" ? v : parseInt(v)),
    float: v => (typeof v === "number" ? v : parseFloat(v)),
    bool: v => (typeof v === "boolean" ? v : ["1", "true", "True"].includes(v)),
    list: v => (Array.isArray(v) ? v : v.split(";")),
    tuple: v => (Array.isArray(v) ? v : v.split(";"))
};

const CONFIGS = {};

const CONFIG_F = [];

export function conf(name, fallback = null, cast = null, ctx = null) {
    const configs = ctx ? ctx.configs : CONFIGS;
    cast = _castR(cast);
    let value = configs[name] === undefined ? fallback : configs[name];
    if (cast && value !== null) value = cast(value);
    return value;
}

export function confS(name, value, ctx = null) {
    const configs = ctx ? ctx.configs : CONFIGS;
    configs[name] = value;
}

function _castR(cast) {
    return CASTS[cast] === undefined ? cast : CASTS[cast];
}

export default conf;
