const assert = require("assert");
const mongoose = require("mongoose");
const yonius = require("../..");
const mock = require("./mock");

yonius.register("mongoose", mongoose);

describe("ModelStore", function() {
    this.timeout(30000);
    beforeEach(async function() {
        const uri = await yonius.confP("MONGO_URL");
        if (!uri) return this.skip();
        await yonius.initMongo(mongoose, uri);
        await mongoose.connection.db.dropDatabase();
    });
    afterEach(async function() {
        await yonius.destroyMongo(mongoose);
    });
    describe("#save()", function() {
        it("should be able to save simple entities", async () => {
            let person = new mock.Person();
            await person.save();

            const pencil = new mock.Pencil();
            await pencil.save();

            person.pencil = pencil;
            await person.save();

            person = await person.reload();
            assert.strictEqual(person.pencil.id, pencil.id);

            const personPencil = await mock.Person.get({ id: person.id, eager: ["pencil"] });
            assert.deepStrictEqual(personPencil.pencil, pencil);
        });
    });
});
