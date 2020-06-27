const assert = require("assert");
const yonius = require("../..");

describe("#register()", function() {
    it("should handle basic cases", async () => {
        let result;

        yonius.register("hello", "world");
        result = yonius.request("hello");
        assert.strictEqual(result, "world");

        yonius.register("hello2", "world2");
        result = yonius.request("hello2");
        assert.strictEqual(result, "world2");

        yonius.unregister("hello");
        assert.throws(() => yonius.request("hello"), Error);
    });
});

describe("#unregister()", function() {
    it("should handle basic cases", async () => {
        yonius.unregister("hello");
        assert.throws(() => yonius.request("hello"), Error);
    });
});
