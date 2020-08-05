const assert = require("assert");
const yonius = require("../..");

describe("#eq()", function() {
    it("should verify basic equal operations", () => {
        let result;

        result = yonius.eq(2)(2);
        assert.strictEqual(result, true);

        result = yonius.eq(4)(4);
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
