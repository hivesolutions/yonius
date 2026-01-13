const assert = require("assert");
const yonius = require("../..");

describe("#sizeRoundUnit()", function() {
    it("should be able to round size values", () => {
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

    it("should be able to justify size values", () => {
        let result;

        result = yonius.sizeRoundUnit(1, 1024, 3, false, false, true);
        assert.strictEqual(result, "   1B");

        result = yonius.sizeRoundUnit(10, 1024, 3, false, false, true);
        assert.strictEqual(result, "  10B");

        result = yonius.sizeRoundUnit(100, 1024, 3, false, false, true);
        assert.strictEqual(result, " 100B");

        result = yonius.sizeRoundUnit(1000, 1024, 3, false, false, true);
        assert.strictEqual(result, "1000B");

        result = yonius.sizeRoundUnit(2048, 1024, 3, false, false, true);
        assert.strictEqual(result, "2.00KB");

        result = yonius.sizeRoundUnit(1, 1024, 3, true, false, true);
        assert.strictEqual(result, "   1B");

        result = yonius.sizeRoundUnit(1024, 1024, 3, true, false, true);
        assert.strictEqual(result, "   1KB");
    });

    it("should be able to use simplified units", () => {
        let result;

        result = yonius.sizeRoundUnit(1024, 1024, 3, true, true, false, true);
        assert.strictEqual(result, "1 K");

        result = yonius.sizeRoundUnit(1048576, 1024, 3, true, true, false, true);
        assert.strictEqual(result, "1 M");

        result = yonius.sizeRoundUnit(1073741824, 1024, 3, true, true, false, true);
        assert.strictEqual(result, "1 G");

        result = yonius.sizeRoundUnit(1099511627776, 1024, 3, true, true, false, true);
        assert.strictEqual(result, "1 T");
    });

    it("should handle zero values", () => {
        let result;

        result = yonius.sizeRoundUnit(0);
        assert.strictEqual(result, "0B");

        result = yonius.sizeRoundUnit(0, 1024, 3, true, true);
        assert.strictEqual(result, "0 B");
    });

    it("should handle very large values", () => {
        let result;

        result = yonius.sizeRoundUnit(1125899906842624, 1024, 3, true, true);
        assert.strictEqual(result, "1 PB");

        result = yonius.sizeRoundUnit(1152921504606846976, 1024, 3, true, true);
        assert.strictEqual(result, "1 EB");
    });
});
