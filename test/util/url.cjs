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

describe("#absoluteUrl()", function() {
    it("should be able to build absolute URLs with BASE_URL", () => {
        let result;

        try {
            yonius.confS("BASE_URL", "https://api.example.com");

            result = yonius.absoluteUrl("/users");
            assert.strictEqual(result, "https://api.example.com/users");

            result = yonius.absoluteUrl("/products/123");
            assert.strictEqual(result, "https://api.example.com/products/123");
        } finally {
            yonius.confS("BASE_URL", undefined);
        }
    });

    it("should return null when no base URL is set", () => {
        let result;

        try {
            yonius.confS("BASE_URL", undefined);

            result = yonius.absoluteUrl("/users");
            assert.strictEqual(result, null);

            result = yonius.absoluteUrl("/products/123");
            assert.strictEqual(result, null);
        } finally {
            yonius.confS("BASE_URL", undefined);
        }
    });

    it("should be able to use custom environment variable name", () => {
        let result;

        try {
            yonius.confS("CUSTOM_BASE_URL", "https://custom.example.com");

            result = yonius.absoluteUrl("/users", "CUSTOM_BASE_URL");
            assert.strictEqual(result, "https://custom.example.com/users");

            result = yonius.absoluteUrl("/admin", "CUSTOM_BASE_URL");
            assert.strictEqual(result, "https://custom.example.com/admin");
        } finally {
            yonius.confS("CUSTOM_BASE_URL", undefined);
        }
    });

    it("should use fallback value when config is not set", () => {
        let result;

        try {
            yonius.confS("BASE_URL", undefined);
            yonius.confS("MISSING_VAR", undefined);

            result = yonius.absoluteUrl("/users", "BASE_URL", "https://fallback.example.com");
            assert.strictEqual(result, "https://fallback.example.com/users");

            result = yonius.absoluteUrl("/api/v1", "MISSING_VAR", "http://localhost:3000");
            assert.strictEqual(result, "http://localhost:3000/api/v1");
        } finally {
            yonius.confS("BASE_URL", undefined);
            yonius.confS("MISSING_VAR", undefined);
        }
    });

    it("should prioritize config value over fallback", () => {
        let result;

        try {
            yonius.confS("BASE_URL", "https://env.example.com");

            result = yonius.absoluteUrl("/users", "BASE_URL", "https://fallback.example.com");
            assert.strictEqual(result, "https://env.example.com/users");
        } finally {
            yonius.confS("BASE_URL", undefined);
        }
    });
});
