const assert = require("assert");
const yonius = require("../..");

describe("#conf()", function() {
    it("should be able to retrieve some values", () => {
        yonius.confS("HELLO", "world");
        const result = yonius.conf("HELLO");
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

describe("#_castR()", function() {
    it("should be able to cast simple types", () => {
        let caster;

        caster = yonius._castR("int");
        assert.strictEqual(caster("12"), 12);
        assert.strictEqual(caster("12.2"), 12);
        assert.strictEqual(isNaN(caster("")), true);

        caster = yonius._castR("float");
        assert.strictEqual(caster("12.2"), 12.2);
        assert.strictEqual(caster("12.22"), 12.22);
        assert.strictEqual(isNaN(caster("")), true);

        caster = yonius._castR("bool");
        assert.strictEqual(caster("1"), true);
        assert.strictEqual(caster("0"), false);
        assert.strictEqual(caster("true"), true);
        assert.strictEqual(caster("false"), false);
        assert.strictEqual(caster("True"), true);
        assert.strictEqual(caster("False"), false);
        assert.strictEqual(caster(""), false);

        caster = yonius._castR("list");
        assert.deepStrictEqual(caster("1;2;3"), ["1", "2", "3"]);
        assert.deepStrictEqual(caster("abc;def;ghi"), ["abc", "def", "ghi"]);
        assert.deepStrictEqual(caster(""), [""]);

        caster = yonius._castR("tuple");
        assert.deepStrictEqual(caster("1;2;3"), ["1", "2", "3"]);
        assert.deepStrictEqual(caster("abc;def;ghi"), ["abc", "def", "ghi"]);
        assert.deepStrictEqual(caster(""), [""]);
    });
});
