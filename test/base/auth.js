const assert = require("assert");
const yonius = require("../..");

describe("#ensurePermissions()", function() {
    it("should handle basic cases", async () => {
        let result;

        const ctx = {
            getAcl: async () => ["admin", "admin.*"]
        };

        result = await yonius.ensurePermissions("admin", ctx);
        assert.strictEqual(result, undefined);

        result = await yonius.ensurePermissions("admin.test", ctx);
        assert.strictEqual(result, undefined);

        await assert.rejects(
            async () => await yonius.ensurePermissions("user", ctx),
            yonius.OperationalError,
            "You don't have authorization to access this resource"
        );
    });
});

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
