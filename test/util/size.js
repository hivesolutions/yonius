const assert = require("assert");
const yonius = require("../..");

describe("#sizeRoundUnit", function() {
    it("should be able to round value", () => {
        let result;

        result = yonius.sizeRoundUnit(209715200, 1024, 3, true, true);
        assert.strictEqual(result, "200 MB");

        result = yonius.sizeRoundUnit(20480, 1024, 3, true, true);
        assert.strictEqual(result, "20 KB");

        result = yonius.sizeRoundUnit(2048, 1024, 3, false, true);
        assert.strictEqual(result, "2.00 KB");

        result = yonius.sizeRoundUnit(2500, 1024, 3, true, true);
        assert.strictEqual(result, "2.44 KB");

        result = yonius.sizeRoundUnit(2500, 1024, 3, false, true);
        assert.strictEqual(result, "2.44 KB");

        result = yonius.sizeRoundUnit(1);
        assert.strictEqual(result, "1B");

        result = yonius.sizeRoundUnit(2048, 2049, 3, false);
        assert.strictEqual(result, "2048B");

        result = yonius.sizeRoundUnit(2049, 1024, 4, false);
        assert.strictEqual(result, "2.001KB");

        result = yonius.sizeRoundUnit(2048, 1024, 0, false);
        assert.strictEqual(result, "2KB");

        result = yonius.sizeRoundUnit(2049, 1024, 0, false);
        assert.strictEqual(result, "2KB");
    });
});
