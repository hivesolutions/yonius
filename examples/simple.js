const yonius = require("..");

async function run() {
    console.info(yonius.conf("OS"));
    const api = new yonius.API();
    api.bind("example", value => console.info(value));
    api.trigger("example", "hello");
}

run();
