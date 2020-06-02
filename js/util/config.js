import * as fs from "fs";
import { resolve, join, normalize, dirname } from "path";
import { pathExists, expandUser, getEnvObject } from "./fs";

const FILE_NAME = "yonius.json";

const HOME_FILE = "~/.home";

const IMPORT_NAMES = ["$import", "$include", "$IMPORT", "$INCLUDE"];

const CASTS = {
    int: v => (typeof v === "number" ? v : parseInt(v)),
    float: v => (typeof v === "number" ? v : parseFloat(v)),
    bool: v => (typeof v === "boolean" ? v : ["1", "true", "True"].includes(v)),
    list: v => (Array.isArray(v) ? v : v.split(";")),
    tuple: v => (Array.isArray(v) ? v : v.split(";"))
};

export const globals =
    typeof global === "undefined"
        ? typeof window === "undefined"
            ? typeof self === "undefined"
                ? {}
                : self
            : window
        : global;

globals.CONFIGS = globals.CONFIGS === undefined ? {} : globals.CONFIGS;

globals.CONFIG_F = globals.CONFIG_F === undefined ? [] : globals.CONFIG_F;

globals.HOMES = globals.HOMES === undefined ? [] : globals.HOMES;

globals.LOADED = globals.LOADED === undefined ? false : globals.LOADED;

export const conf = function(name, fallback = undefined, cast = null, ctx = null) {
    const configs = ctx ? ctx.configs : globals.CONFIGS;
    cast = _castR(cast);
    let value = configs[name] === undefined ? fallback : configs[name];
    if (cast && value !== undefined && value !== null) value = cast(value);
    return value;
};

export const confP = async function(name, fallback = undefined, cast = null, ctx = null) {
    await load();
    return conf(name, fallback, cast, ctx);
};

export const confS = function(name, value, ctx = null) {
    const configs = ctx ? ctx.configs : globals.CONFIGS;
    configs[name] = value;
};

export const load = async function(
    names = [FILE_NAME],
    path = null,
    encoding = "utf-8",
    force = false,
    ctx = null
) {
    if (globals.LOADED && !force) return;
    let paths = [];
    const homes = await getHomes();
    for (const home of homes) {
        paths = paths.concat([join(home), join(home, ".config")]);
    }
    if (path) paths.push(path);
    for (const path of paths) {
        for (const name of names) {
            await loadFile(name, path, encoding, ctx);
        }
    }
    await loadEnv(ctx);
    globals.LOADED = true;
};

export const loadFile = async function(
    name = FILE_NAME,
    path = null,
    encoding = "utf-8",
    ctx = null
) {
    const configs = ctx ? ctx.configs : globals.CONFIGS;
    const configF = ctx ? ctx.configF : globals.CONFIG_F;

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

    exists = await pathExists(filePath);
    if (!exists) return;

    exists = configF.includes(filePath);
    if (exists) configF.splice(configF.indexOf(filePath), 1);
    configF.push(filePath);

    const data = await fs.promises.readFile(filePath, { encoding: encoding });
    const dataJ = JSON.parse(data);

    await _loadIncludes(basePath, dataJ, encoding);

    for ([key, value] of Object.entries(dataJ)) {
        if (!_isValid(key)) continue;
        configs[key] = value;
    }
};

export const loadEnv = async function(ctx = null) {
    const env = getEnvObject();
    const configs = ctx ? ctx.configs : globals.CONFIGS;
    if (env === undefined || env === null) return;
    Object.entries(env).forEach(function([key, value]) {
        configs[key] = value;
    });
};

export const getHomes = async function(
    filePath = HOME_FILE,
    fallback = "~",
    encoding = "utf-8",
    forceDefault = false
) {
    if (globals.HOMES.length > 0) return globals.HOMES;

    const env = getEnvObject();

    globals.HOMES = env.HOMES === undefined ? null : env.HOMES;
    globals.HOMES = globals.HOMES ? globals.HOMES.split(";") : globals.HOMES;
    if (globals.HOMES !== null) return globals.HOMES;

    fallback = expandUser(fallback);
    fallback = normalize(fallback);
    globals.HOMES = [fallback];

    filePath = expandUser(filePath);
    filePath = normalize(filePath);
    const exists = await pathExists(filePath);
    if (!exists) return globals.HOMES;

    if (!forceDefault) globals.HOMES.splice(0, globals.HOMES.length);

    let data = await fs.promises.readFile(filePath, { encoding: encoding });
    data = data.trim();

    let paths = data.split(/\r?\n/);
    paths = paths.map(v => v.trim());

    for (let path of paths) {
        path = path.trim();
        if (!path) continue;
        path = expandUser(path);
        path = normalize(path);
        globals.HOMES.push(path);
    }

    return globals.HOMES;
};

export const _castR = function(cast) {
    return CASTS[cast] === undefined ? cast : CASTS[cast];
};

export const _loadIncludes = async function(basePath, config, encoding = "utf-8") {
    let includes = [];

    for (const alias of IMPORT_NAMES) {
        includes = config[alias] === undefined ? includes : config[alias];
    }

    if (typeof includes === "string") {
        includes = includes.split(";");
    }

    for (const include of includes) {
        await loadFile(include, basePath, encoding);
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

export default conf;
