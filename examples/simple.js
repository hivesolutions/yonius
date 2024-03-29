import { API, confP } from "../dist/yonius.js";

async function run() {
    const api = new API();
    api.bind("example", value => console.info(value));
    api.trigger("example", "hello");
    console.info(await confP("LEVEL"));
}

run();
