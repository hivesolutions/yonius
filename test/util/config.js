const assert = require("assert");
const yonius = require("../..");

describe("#conf", function() {
    it("should be able to retrieve some values", () => {
        let result;

        yonius.confS("HELLO", "world");
        result = yonius.conf("HELLO");
        assert.strictEqual(result, "world");
    });

    it("should be able to cast some values", () => {
        let result;

        yonius.confS("HELLO", "1");
        result = yonius.conf("HELLO", undefined, "int");
        assert.strictEqual(result, 1);

        yonius.confS("HELLO", "1.1");
        result = yonius.conf("HELLO", undefined, "float");
        assert.strictEqual(result, 1.1);

        yonius.confS("HELLO", "1");
        result = yonius.conf("HELLO", undefined, "bool");
        assert.strictEqual(result, true);

        yonius.confS("HELLO", "0");
        result = yonius.conf("HELLO", undefined, "bool");
        assert.strictEqual(result, false);

        yonius.confS("HELLO", "true");
        result = yonius.conf("HELLO", undefined, "bool");
        assert.strictEqual(result, true);

        yonius.confS("HELLO", "false");
        result = yonius.conf("HELLO", undefined, "bool");
        assert.strictEqual(result, false);
    });

    it("should be able to run some internal validations", () => {
        yonius.confS("LEVEL", "INFO");
        assert.strictEqual(yonius._isDevel(), false);

        yonius.confS("LEVEL", "DEBUG");
        assert.strictEqual(yonius._isDevel(), true);

        assert.strictEqual(yonius._isValid("LEVEL"), true);

        assert.strictEqual(yonius._isValid("$include"), false);
    });
});
