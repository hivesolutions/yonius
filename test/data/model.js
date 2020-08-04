const assert = require("assert");
const mongoose = require("mongoose");
const yonius = require("../..");
const mock = require("./mock");

yonius.register("mongoose", mongoose);

describe("Model", function() {
    this.timeout(30000);
    describe("#fill()", function() {
        it("should be able to run simple fill operations", () => {
            const person = mock.Person.niw();
            assert.strictEqual(person.id, undefined);
            assert.strictEqual(person.idSafe, undefined);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);
        });
    });
});

describe("ModelStore", function() {
    this.timeout(30000);
    beforeEach(async function() {
        let uri = await yonius.confP("MONGOHQ_URL", null);
        uri = await yonius.confP("MONGOLAB_URI", uri);
        uri = await yonius.confP("MONGO_URL", uri);
        if (!uri) return this.skip();
        await yonius.initMongo(mongoose, uri);
    });
    afterEach(async function() {
        await yonius.destroyMongo(mongoose);
    });
    describe("#increments", function() {
        it("should be able to compute increments", async () => {
            assert.deepStrictEqual(mock.Person.increments, ["id", "idSafe"]);
        });
    });
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
