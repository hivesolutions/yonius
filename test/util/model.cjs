const assert = require("assert");
const yonius = require("../..");

class MockCollection {
    findOne(params, fields, options) {
        this.lastCall = {
            params: params,
            fields: fields,
            options: options
        };
        const result =
            MockCollection.result !== undefined
                ? MockCollection.result
                : { id: "mock", name: "mock" };
        MockCollection.resetResult();
        return result;
    }

    find(params, fields, options) {
        this.lastCall = {
            params: params,
            fields: fields,
            options: options
        };
        const result =
            MockCollection.result !== undefined
                ? MockCollection.result
                : [{ id: "mock", name: "mock" }];
        MockCollection.resetResult();
        return result;
    }

    static setResult(result) {
        MockCollection.result = result;
    }

    static resetResult() {
        MockCollection.result = undefined;
    }
}

class MockModel extends yonius.ModelStore {
    static _collection(options) {
        return new MockCollection();
    }

    static get lastCall() {
        return this.collection.lastCall;
    }

    static get schema() {
        return {
            id: {
                type: String,
                unique: true,
                required: true
            },
            name: {
                type: String,
                default: true
            }
        };
    }

    static get idName() {
        return "id";
    }
}

describe("#get()", function() {
    it("should allow filter", async () => {
        await MockModel.get({
            brand: "swear"
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: "swear"
        });
    });

    it("should raise exception", async () => {
        MockCollection.setResult(null);

        await assert.rejects(
            MockModel.get({
                brand: "swear"
            }),
            err => {
                assert.strictEqual(err instanceof yonius.NotFoundError, true);
                return true;
            }
        );
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: "swear"
        });
    });

    it("should ignore exception", async () => {
        MockCollection.setResult(null);

        await MockModel.get({
            brand: "swear",
            raiseE: false
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: "swear"
        });
    });
});

describe("#find()", function() {
    it("should allow filter", async () => {
        await MockModel.find({
            find_d: "brand:eq:swear",
            filter_operator: "$or"
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: "swear",
            filter_operator: "$or"
        });
    });

    it("should allow filters", async () => {
        await MockModel.find({
            find_d: ["nr1:gt:5", "nr2:lt:10"],
            filter_operator: "$and"
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            nr1: { $gt: "5" },
            nr2: { $lt: "10" },
            filter_operator: "$and"
        });
    });

    it("should allow likei", async () => {
        await MockModel.find({
            find_d: "brand:likei:swear",
            filter_operator: "$or"
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: {
                $options: "-i",
                $regex: "^.*swear.*$"
            },
            filter_operator: "$or"
        });
    });

    it("should allow find_s", async () => {
        await MockModel.find({
            find_s: "swear"
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            name: {
                $options: "",
                $regex: "swear"
            }
        });
    });

    it("should allow case-insentitive find_s", async () => {
        await MockModel.find({
            find_s: "swear",
            find_i: 1
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            name: {
                $options: "-i",
                $regex: "swear"
            }
        });
    });

    it("should allow pages and sorting", async () => {
        await MockModel.find({
            find_d: "brand:likei:swear",
            filter_operator: "$or",
            skip: 5,
            limit: 10,
            sort: [["name", 1]]
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: {
                $options: "-i",
                $regex: "^.*swear.*$"
            },
            filter_operator: "$or"
        });
        assert.deepStrictEqual(await MockModel.lastCall.options, {
            limit: 10,
            skip: 5,
            sort: { name: 1 }
        });
    });

    it("should not raise exception", async () => {
        MockCollection.setResult([]);

        await MockModel.find({
            find_d: "brand:eq:swear",
            filter_operator: "$or"
        });
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: "swear",
            filter_operator: "$or"
        });
    });

    it("should raise exception when asked", async () => {
        MockCollection.setResult([]);

        await assert.rejects(
            MockModel.find({
                find_d: "brand:eq:swear",
                filter_operator: "$or",
                raiseE: true
            }),
            err => {
                assert.strictEqual(err instanceof yonius.NotFoundError, true);
                return true;
            }
        );
        assert.deepStrictEqual(await MockModel.lastCall.params, {
            brand: "swear",
            filter_operator: "$or"
        });
    });
});
