const assert = require("assert");
const ripe = require("../..");

describe("#urlEncode", function() {
    it("should be able to encode simple values", () => {
        let result;

        result = ripe.urlEncode({ hello: "world" });
        assert.strictEqual(result, "hello=world");

        result = ripe.urlEncode([["hello", "world"]]);
        assert.strictEqual(result, "hello=world");

        result = ripe.urlEncode([["hello", "world"], ["world", "hello"]]);
        assert.strictEqual(result, "hello=world&world=hello");
    });

    it("should be able to encode unicode values", () => {
        let result;

        result = ripe.urlEncode({ hello: "世界" });
        assert.strictEqual(result, "hello=%E4%B8%96%E7%95%8C");

        result = ripe.urlEncode([["hello", "世界"]]);
        assert.strictEqual(result, "hello=%E4%B8%96%E7%95%8C");
    });
});
