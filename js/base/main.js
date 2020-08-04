import { loadConf } from "../util";
import { OperationalError } from "./error";

const REGISTRY = {};

export const load = async function() {
    await loadConf();
};

export const unload = async function() {};

export const register = function(name, value) {
    REGISTRY[name] = value;
};

export const unregister = function(name) {
    delete REGISTRY[name];
};

export const request = function(name) {
    if (REGISTRY[name] === undefined) {
        throw new OperationalError(`Name '${name}' not found in registry`);
    }
    return REGISTRY[name];
};

export default load;
