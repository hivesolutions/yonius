const assert = require("assert");
const yonius = require("../..");

describe("#conf", function() {
    it("should be able to retrieve some values", () => {
        let result;

        yonius.confS("HELLO", "world");
        result = yonius.conf("HELLO");
        assert.strictEqual(result, "world");
    });
});
