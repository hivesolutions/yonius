import * as fs from "fs";

export const pathExists = async function(path) {
    try {
        await fs.promises.access(path);
    } catch (error) {
        return false;
    }
    return true;
};
