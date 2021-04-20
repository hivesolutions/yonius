const assert = require("assert");
const mongoose = require("mongoose");
const yonius = require("../..");
const mock = require("./mock");

yonius.register("mongoose", mongoose);

describe("ModelStore", function() {
    this.timeout(30000);
    beforeEach(async function() {
        const uri = "mongodb://localhost/cenas2";
        await yonius.initMongo(mongoose, uri);
        await mongoose.connection.db.dropDatabase();
    });
    afterEach(async function() {
        await yonius.destroyMongo(mongoose);
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
});
