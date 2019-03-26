const assert = require("assert");
const ripe = require("../..");

describe("#verify", function() {
    it("should be able to verify simple values", () => {
        assert.throws(() => ripe.verify(false), Error);
    });
});
