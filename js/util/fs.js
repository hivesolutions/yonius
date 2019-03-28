import * as fs from "fs";
import { join } from "path";
import { env } from "process";

const HOME_DIR = env[process.platform === "win32" ? "USERPROFILE" : "HOME"];

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
    if (path === "~") return HOME_DIR;
    if (path.slice(0, 2) !== "~/") return path;
    return join(HOME_DIR, path.slice(2));
};
