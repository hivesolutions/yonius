const assert = require("assert");
const yonius = require("../..");

describe("#urlEncode()", function() {
    it("should be able to encode simple values", () => {
        let result;

        result = yonius.urlEncode({ hello: "world" });
        assert.strictEqual(result, "hello=world");

        result = yonius.urlEncode([["hello", "world"]]);
        assert.strictEqual(result, "hello=world");

        result = yonius.urlEncode([
            ["hello", "world"],
            ["world", "hello"]
        ]);
        assert.strictEqual(result, "hello=world&world=hello");
    });

    it("should be able to encode unicode values", () => {
        let result;

        result = yonius.urlEncode({ hello: "世界" });
        assert.strictEqual(result, "hello=%E4%B8%96%E7%95%8C");

        result = yonius.urlEncode([["hello", "世界"]]);
        assert.strictEqual(result, "hello=%E4%B8%96%E7%95%8C");
    });

    it("should be able to encode multiple values", () => {
        let result;

        result = yonius.urlEncode({ hello: ["world1", "world2"] });
        assert.strictEqual(result, "hello=world1&hello=world2");

        result = yonius.urlEncode([["hello", ["world1", "world2"]]]);
        assert.strictEqual(result, "hello=world1&hello=world2");
    });

    it("should be able to ignore null or undefined values", () => {
        let result;

        result = yonius.urlEncode({ hello1: null, hello2: "world2" });
        assert.strictEqual(result, "hello2=world2");

        result = yonius.urlEncode([
            ["hello1", null],
            ["hello2", "world2"]
        ]);
        assert.strictEqual(result, "hello2=world2");

        result = yonius.urlEncode({ hello1: undefined, hello2: "world2" });
        assert.strictEqual(result, "hello2=world2");

        result = yonius.urlEncode([
            ["hello1", undefined],
            ["hello2", "world2"]
        ]);
        assert.strictEqual(result, "hello2=world2");
    });
});
