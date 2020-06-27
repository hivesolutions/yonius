const assert = require("assert");
const yonius = require("../..");

describe("#verify()", function() {
    it("should be able to verify simple values", () => {
        assert.throws(() => yonius.verify(false), Error);
        assert.doesNotThrow(() => yonius.verify(true), Error);
    });
});

describe("#verifyEqual()", function() {
    it("should be able to verify equal values", () => {
        assert.throws(() => yonius.verifyEqual(1, 2), Error);
        assert.doesNotThrow(() => yonius.verifyEqual(1, 1), Error);
    });
});

describe("#verifyNotEqual()", function() {
    it("should be able to verify non equal values", () => {
        assert.throws(() => yonius.verifyNotEqual(1, 1), Error);
        assert.doesNotThrow(() => yonius.verifyNotEqual(1, 2), Error);
    });
});

describe("#verifyMany()", function() {
    it("should be able to verify simple many values", () => {
        assert.throws(() => yonius.verifyMany([false]), Error);
        assert.throws(() => yonius.verifyMany([true, false]), Error);
        assert.doesNotThrow(() => yonius.verifyMany([true]), Error);
        assert.doesNotThrow(() => yonius.verifyMany([true, true]), Error);
    });
});
