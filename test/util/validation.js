const assert = require("assert");
const yonius = require("../..");

describe("#eq()", function() {
    it("should verify basic equal operations", () => {
        let result;

        result = yonius.eq(2)(2);
        assert.strictEqual(result, true);

        result = yonius.eq(4)(4);
        assert.strictEqual(result, true);

        result = yonius.eq(4)(null);
        assert.strictEqual(result, true);

        assert.throws(
            () => yonius.eq(4)(5),
            err => {
                assert(err instanceof yonius.ValidationError);
                assert(err.message === "Must be equal to 4");
                return true;
            }
        );
    });
});

describe("#gt()", function() {
    it("should verify basic greater than operations", () => {
        let result;

        result = yonius.gt(2)(3);
        assert.strictEqual(result, true);

        result = yonius.gt(4)(5);
        assert.strictEqual(result, true);

        result = yonius.gt(4)(null);
        assert.strictEqual(result, true);

        assert.throws(
            () => yonius.gt(4)(4),
            err => {
                assert(err instanceof yonius.ValidationError);
                assert(err.message === "Must be greater than 4");
                return true;
            }
        );
    });
});

describe("#notEmpty()", function() {
    it("should verify basic not empty conditions", () => {
        let result;

        result = yonius.notEmpty()("hello");
        assert.strictEqual(result, true);

        result = yonius.notEmpty()("hello world");
        assert.strictEqual(result, true);

        result = yonius.notEmpty()(null);
        assert.strictEqual(result, true);

        assert.throws(
            () => yonius.notEmpty()(""),
            err => {
                assert(err instanceof yonius.ValidationError);
                assert(err.message === "Value is empty");
                return true;
            }
        );
    });
});
