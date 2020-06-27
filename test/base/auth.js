const assert = require("assert");
const yonius = require("../..");

describe("#toTokensM()", function() {
    it("should covert tokens to map representation", () => {
        let result;

        result = yonius.toTokensM(["admin"]);
        assert.deepStrictEqual(result, { admin: true });

        result = yonius.toTokensM(["admin", "admin.read"]);
        assert.deepStrictEqual(result, {
            admin: {
                _: true,
                read: true
            }
        });

        result = yonius.toTokensM(["admin.read", "admin"]);
        assert.deepStrictEqual(result, {
            admin: {
                _: true,
                read: true
            }
        });

        result = yonius.toTokensM(["admin", "admin.*"]);
        assert.deepStrictEqual(result, {
            admin: {
                _: true,
                "*": true
            }
        });
    });

    it("should handle edge cases", () => {
        let result;

        result = yonius.toTokensM(undefined);
        assert.deepStrictEqual(result, {});

        result = yonius.toTokensM(null);
        assert.deepStrictEqual(result, {});

        result = yonius.toTokensM("error");
        assert.deepStrictEqual(result, {});
    });
});
