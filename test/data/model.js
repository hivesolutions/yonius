const assert = require("assert");
const yonius = require("../..");
const mock = require("./mock");

describe("Model", function() {
    this.timeout(30000);
    describe("#fill()", function() {
        it("should be able to run simple fill operations", () => {
            const person = mock.Person.niw();
            assert.strictEqual(person.identifier, undefined);
            assert.strictEqual(person.identifierSafe, undefined);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);
        });
    });
});

describe("ModelStore", function() {
    this.timeout(30000);
    describe("#save()", function() {
        it("should be able to save simple entities", async () => {
            const person = new mock.Person();
            await person.save();
        });
    });
});

describe("#typeD()", function() {
    it("should handle basic coercing", async () => {
        let result;

        result = yonius.typeD("int");
        assert.strictEqual(result, null);

        result = yonius.typeD("list");
        assert.deepStrictEqual(result, []);

        result = yonius.typeD("dict");
        assert.deepStrictEqual(result, {});

        result = yonius.typeD("object");
        assert.deepStrictEqual(result, {});

        result = yonius.typeD("custom", "hello");
        assert.deepStrictEqual(result, "hello");
    });
});
