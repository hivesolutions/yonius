import { loadConf } from "../util";

export const load = async function() {
    await loadConf();
};

export const unload = async function() {};

export default load;
