const assert = require("assert");
const yonius = require("../..");

describe("#equal()", function() {
    it("should be able to verify that primitive values are equal", () => {
        let result;

        result = yonius.equal(1, 1);
        assert.strictEqual(result, true);

        result = yonius.equal(1, 2);
        assert.strictEqual(result, false);

        result = yonius.equal("string", "string");
        assert.strictEqual(result, true);

        result = yonius.equal("string", "unknown");
        assert.strictEqual(result, false);
    });

    it("should be able to verify that date values are equal", () => {
        let result;

        result = yonius.equal(new Date(), new Date(2000, 1, 1));
        console.log(new Date(), new Date(2000, 1, 1), result);
        assert.strictEqual(result, false);

        const date = new Date();
        result = yonius.equal(date, date);
        assert.strictEqual(result, true);
    });

    it("should be able to verify that object values are equal", () => {
        const object = { id: 1, name: "name" };
        let result;

        result = yonius.equal(object, object);
        assert.strictEqual(result, true);

        result = yonius.equal(object, { id: 1 });
        assert.strictEqual(result, false);
    });
});
