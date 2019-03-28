const yonius = require("..");

async function run() {
    yonius.loadConf();
    console.info(yonius.conf("HOME"));
    const api = new yonius.API();
    api.bind("example", value => console.info(value));
    api.trigger("example", "hello");
}

run();
