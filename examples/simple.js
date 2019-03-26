const yonius = require("..");

async function run() {
    const api = new yonius.API();
    api.trigger("example");
}

run();
