const assert = require("assert");
const ripe = require("../..");

describe("#verify", function() {
    it("should be able to verify simple values", () => {
        assert.throws(() => ripe.verify(false), Error);
        assert.doesNotThrow(() => ripe.verify(true), Error);
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
