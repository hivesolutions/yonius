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
        const uri = await yonius.confP("MONGO_URL");
        if (!uri) return this.skip();
        await yonius.initMongo(mongoose, uri);
        await mongoose.connection.db.dropDatabase();
    });
    afterEach(async function() {
        await yonius.destroyMongo(mongoose);
    });
    describe("#increments", function() {
        it("should be able to compute increments", async () => {
            assert.deepStrictEqual(mock.Person.increments, ["id", "idSafe"]);
        });
    });
    describe("#get()", function() {
        it("should be able to resolve references", async () => {
            let person = new mock.Person();
            person.name = "Name";

            const cat = new mock.Cat();
            cat.name = "NameCat";
            await cat.save();

            const catFriend = new mock.Cat();
            catFriend.name = "NameCatFriend";
            await catFriend.save();

            cat.friend = catFriend;
            await cat.save();

            person.cats = [cat];
            await person.save();

            person = await mock.Person.get({ id: 1 });
            assert.strictEqual(person.cats.isResolved, false);
            assert.strictEqual(person.car, undefined);
            assert.strictEqual(await person.cats[0].get("name"), "NameCat");

            person = await mock.Person.get({ id: 1, eager: ["cats"] });
            assert.strictEqual(person.cats.isResolved, true);
            let personFriend = await person.cats[0].get("friend");
            assert.strictEqual(personFriend.isResolved, false);
            assert.strictEqual(person.cats.length, 1);
            assert.strictEqual(person.cats[0].name, "NameCat");

            person = await mock.Person.get({ id: 1, eager: ["cats.friend"] });
            assert.strictEqual(person.cats.isResolved, true);
            personFriend = await person.cats[0].get("friend");
            assert.strictEqual(personFriend.isResolved, true);
            assert.strictEqual(person.cats.length, 1);
            assert.strictEqual(await person.cats[0].get("name"), "NameCat");
            assert.strictEqual(await personFriend.get("name"), "NameCatFriend");

            person = await mock.Person.get({ id: 1 });
            person.cats = [];
            await person.save();

            person = await mock.Person.get({ id: 1 });
            assert.strictEqual(person.cats.length, 0);

            person = await mock.Person.get({ id: 1, eager: ["cats"] });
            assert.strictEqual(person.cats.length, 0);
        });

        it("should be able to get eagerly", async () => {
            let person = new mock.Person();
            person.name = "Name";
            await person.save();

            let car = new mock.Car();
            car.name = "Car";
            await car.save();

            let garage = new mock.Garage();
            garage.name = "Garage";
            await garage.save();

            const address = new mock.Address();
            address.street = "Address";
            await address.save();

            person = await mock.Person.get({ id: 1, eagerL: true });
            person.car = car;
            await person.save();

            car = await mock.Car.get({ id: 1, eagerL: true });
            car.garage = garage;
            await car.save();

            garage = await mock.Garage.get({ id: 1, eagerL: true });
            garage.address = address;
            await garage.save();

            person = await mock.Person.get({ id: 1, eagerL: true });
            assert.strictEqual(person.car.isResolved, true);
            assert.strictEqual(await person.car.get("name"), "Car");
            const personGarage = await person.car.get("garage");
            assert.strictEqual(personGarage.isResolved, true);
            assert.strictEqual(await personGarage.get("name"), "Garage");
            const personAddress = await personGarage.get("address");
            assert.strictEqual(personAddress.isResolved, true);
            assert.strictEqual(await personAddress.get("street"), "Address");
        });

        it("should be able to get with unresolved references", async () => {
            let person = new mock.Person();
            person.name = "Name";
            await person.save();

            const car = new mock.Car();
            car.name = "Car";
            await car.save();

            person = await mock.Person.get({ id: 1 });
            person.car = car;
            await person.save();

            person = await mock.Person.get({ id: 1 });
            assert.strictEqual(await person.car.isResolvable(), true);
            assert.strictEqual(person.car === null, false);
            assert.strictEqual(await person.car.get("name"), "Car");

            await car.delete();
            person = await mock.Person.get({ id: 1 });
            assert.strictEqual(await person.car.isResolvable(), false);
            assert.strictEqual(person.car === null, false);
        });
    });
    describe("#save()", function() {
        it("should be able to save simple entities", async () => {
            const person = new mock.Person();
            assert.strictEqual(person.id, undefined);
            assert.strictEqual(person.idSafe, undefined);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);

            await person.save();
            assert.strictEqual(person.id, 1);
            assert.strictEqual(person.idSafe, 1);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);
        });

        it("should be able to validate models", async () => {
            const person = new mock.Person();
            await person.save();

            person.name = "";
            await assert.rejects(
                async () => await person.save(),
                err => {
                    assert.strictEqual(err instanceof yonius.ValidationError, true);
                    assert.strictEqual(
                        err.message,
                        "Invalid model: ValidationError: Value is empty"
                    );
                    return true;
                }
            );
        });
    });

    describe("#advance()", function() {
        it("should be able to advance values for entities", async () => {
            let result = await mock.Person.count();
            assert.strictEqual(result, 0);

            let person = new mock.Person();
            person.age = 1;
            person.name = "Name";
            await person.save();

            result = await mock.Person.count();
            assert.strictEqual(result, 1);

            result = await person.advance("age");
            assert.strictEqual(result, 2);
            assert.strictEqual(person.age, 2);

            person = await person.reload();
            assert.strictEqual(person.age, 2);

            result = await person.advance("age", 2);
            assert.strictEqual(result, 4);
            assert.strictEqual(person.age, 4);

            person = await person.reload();
            assert.strictEqual(person.age, 4);

            result = await person.advance("age", -2);
            assert.strictEqual(result, 2);
            assert.strictEqual(person.age, 2);

            person = await person.reload();
            assert.strictEqual(person.age, 2);
        });
    });

    describe("#reload()", function() {
        it("should be able to reload simple entities", async () => {
            let person = new mock.Person();
            assert.strictEqual(person.id, undefined);
            assert.strictEqual(person.idSafe, undefined);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);

            await person.save();
            assert.strictEqual(person.id, 1);
            assert.strictEqual(person.idSafe, 1);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);

            person = await person.reload();
            assert.strictEqual(person.id, 1);
            assert.strictEqual(person.idSafe, 1);
            assert.strictEqual(person.name, "dummy");
            assert.strictEqual(person.age, null);
            assert.strictEqual(person.info, null);
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