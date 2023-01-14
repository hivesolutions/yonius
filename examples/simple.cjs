const yonius = require("..");

async function run() {
    const api = new yonius.API();
    api.bind("example", value => console.info(value));
    api.trigger("example", "hello");
    console.info(await yonius.confP("LEVEL"));
}

run();
