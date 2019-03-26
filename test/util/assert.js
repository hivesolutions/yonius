const assert = require("assert");
const ripe = require("../..");

describe("#verify", function() {
    it("should be able to verify simple values", () => {
        assert.throws(() => ripe.verify(false), Error);
        assert.doesNotThrow(() => ripe.verify(true), Error);
    });
});

describe("#verifyEqual", function() {
    it("should be able to verify equal values", () => {
        assert.throws(() => ripe.verifyEqual(1, 2), Error);
        assert.doesNotThrow(() => ripe.verifyEqual(1, 1), Error);
    });
});

describe("#verifyNotEqual", function() {
    it("should be able to verify non equal values", () => {
        assert.throws(() => ripe.verifyNotEqual(1, 1), Error);
        assert.doesNotThrow(() => ripe.verifyNotEqual(1, 2), Error);
    });
});

describe("#verifyMany", function() {
    it("should be able to verify simple many values", () => {
        assert.throws(() => ripe.verifyMany([false]), Error);
        assert.throws(() => ripe.verifyMany([true, false]), Error);
        assert.doesNotThrow(() => ripe.verifyMany([true]), Error);
        assert.doesNotThrow(() => ripe.verifyMany([true, true]), Error);
    });
});
