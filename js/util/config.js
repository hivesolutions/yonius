import * as fs from "fs";
import { resolve, join, normalize, dirname } from "path";
import { env } from "process";
import { pathExists } from "./fs";

const FILE_NAME = "yonius.json";

const IMPORT_NAMES = ["$import", "$include", "$IMPORT", "$INCLUDE"];

const CASTS = {
    int: v => (typeof v === "number" ? v : parseInt(v)),
    float: v => (typeof v === "number" ? v : parseFloat(v)),
    bool: v => (typeof v === "boolean" ? v : ["1", "true", "True"].includes(v)),
    list: v => (Array.isArray(v) ? v : v.split(";")),
    tuple: v => (Array.isArray(v) ? v : v.split(";"))
};

const CONFIGS = {};

const CONFIG_F = [];

export const conf = function(name, fallback = undefined, cast = null, ctx = null) {
    const configs = ctx ? ctx.configs : CONFIGS;
    cast = _castR(cast);
    let value = configs[name] === undefined ? fallback : configs[name];
    if (cast && value !== undefined && value !== null) value = cast(value);
    return value;
};

export const confS = function(name, value, ctx = null) {
    const configs = ctx ? ctx.configs : CONFIGS;
    configs[name] = value;
};

export const load = async function(ctx = null) {
    await loadFile("c:/users/joamag/desktop/tobias.json");
    await loadEnv(ctx);
};

export const loadFile = async function(
    name = FILE_NAME,
    path = null,
    encoding = "utf-8",
    ctx = null
) {
    const configs = ctx ? ctx.configs : CONFIGS;
    const configF = ctx ? ctx.configF : CONFIG_F;

    let key;
    let value;
    let exists;
    let filePath;

    if (path) path = normalize(path);
    if (path) filePath = join(path, name);
    else filePath = name;

    filePath = resolve(filePath);
    filePath = normalize(filePath);
    const basePath = dirname(filePath);

    exists = pathExists(filePath);
    if (!exists) return;

    exists = configF.includes(filePath);
    if (exists) configF.splice(configF.indexOf(filePath), 1);
    configF.push(filePath);

    const data = await fs.promises.readFile(filePath, { encoding: encoding });
    const dataJ = JSON.parse(data);

    _loadIncludes(basePath, dataJ, encoding);

    for ([key, value] of Object.values(dataJ)) {
        if (!_isValid(key)) continue;
        configs[key] = value;
    }
};

export const loadEnv = async function(ctx = null) {
    const configs = ctx ? ctx.configs : CONFIGS;
    if (env === undefined || env === null) return;
    Object.entries(env).forEach(function([key, value]) {
        configs[key] = value;
    });
};

export const _castR = function(cast) {
    return CASTS[cast] === undefined ? cast : CASTS[cast];
};

export const _loadIncludes = function(basePath, config, encoding = "utf-8") {
    let includes = [];

    for (const alias of IMPORT_NAMES) {
        includes = config[alias] === undefined ? includes : config[alias];
    }

    if (typeof includes === "string") {
        includes = includes.split(";");
    }

    for (const include of includes) {
        loadFile(include, basePath, encoding);
    }
};

export const _isValid = function(key) {
    if (IMPORT_NAMES.includes(key)) return false;
    return true;
};

export const _isDevel = function() {
    return ["DEBUG"].includes(conf("LEVEL", "INFO"));
};

export const _isSecure = function() {
    return conf("SECURE", true, "bool");
};

load();

export default conf;
