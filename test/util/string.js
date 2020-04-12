const assert = require("assert");
const yonius = require("../..");

describe("#camelToUnderscore", function() {
    it("should be able to convert simple values", () => {
        let result;

        result = yonius.camelToUnderscore(null);
        assert.strictEqual(result, null);

        result = yonius.camelToUnderscore("");
        assert.strictEqual(typeof result, "string");
        assert.strictEqual(result, "");

        result = yonius.camelToUnderscore("HelloWorld");
        assert.strictEqual(typeof result, "string");
        assert.strictEqual(result, "hello_world");
    });
});
