import * as fs from "fs";
import { join } from "path";
import { env } from "process";

let HOME_DIR = null;

export const pathExists = async function(path) {
    try {
        await fs.promises.access(path);
    } catch (error) {
        return false;
    }
    return true;
};

export const expandUser = function(path) {
    if (!path) return path;
    if (path === "~") return _homeDir();
    if (path.slice(0, 2) !== "~/") return path;
    return join(HOME_DIR, path.slice(2));
};

const _homeDir = function() {
    if (HOME_DIR !== null) return HOME_DIR;
    const isWindows = Boolean(process && process.platform === "win32");
    HOME_DIR = env[isWindows ? "USERPROFILE" : "HOME"] || "/";
    return HOME_DIR;
};
