const assert = require("assert");
const yonius = require("../..");

class MockCollection {
    find(params, fields, options) {
        this.lastCall = {
            params: params,
            fields: fields,
            options: options
        };
        return [];
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

describe("#find()", function() {
    it("should allow filter", () => {
        MockModel.find({
            find_d: "brand:eq:swear",
            filter_operator: "$or"
        });
        assert.deepStrictEqual(MockModel.lastCall.params, {
            brand: "swear",
            filter_operator: "$or"
        });
    });

    it("should allow filters", () => {
        MockModel.find({
            find_d: ["nr1:gt:5", "nr2:lt:10"],
            filter_operator: "$and"
        });
        assert.deepStrictEqual(MockModel.lastCall.params, {
            nr1: { $gt: "5" },
            nr2: { $lt: "10" },
            filter_operator: "$and"
        });
    });

    it("should allow likei", () => {
        MockModel.find({
            find_d: "brand:likei:swear",
            filter_operator: "$or"
        });
        assert.deepStrictEqual(MockModel.lastCall.params, {
            brand: {
                $options: "-i",
                $regex: "^.*swear.*$"
            },
            filter_operator: "$or"
        });
    });

    it("should allow find_s", () => {
        MockModel.find({
            find_s: "swear"
        });
        assert.deepStrictEqual(MockModel.lastCall.params, {
            name: {
                $options: "",
                $regex: "swear"
            }
        });
    });

    it("should allow case-insentitive find_s", () => {
        MockModel.find({
            find_s: "swear",
            find_i: 1
        });
        assert.deepStrictEqual(MockModel.lastCall.params, {
            name: {
                $options: "-i",
                $regex: "swear"
            }
        });
    });

    it("should allow pages and sorting", () => {
        MockModel.find({
            find_d: "brand:likei:swear",
            filter_operator: "$or",
            skip: 5,
            limit: 10,
            sort: [["name", 1]]
        });
        assert.deepStrictEqual(MockModel.lastCall.params, {
            brand: {
                $options: "-i",
                $regex: "^.*swear.*$"
            },
            filter_operator: "$or"
        });
        assert.deepStrictEqual(MockModel.lastCall.options, {
            limit: 10,
            skip: 5,
            sort: { name: 1 }
        });
    });
});
