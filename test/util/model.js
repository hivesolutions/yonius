const assert = require("assert");
const yonius = require("../..");

class MockCollection {
    find(params) {
        this.lastCall = params;
    }
}

describe("#find()", function() {
    it("should allow filter", () => {
        const mock = new MockCollection();
        yonius.find(
            {
                find_d: "brand:eq:swear",
                filter_operator: "$or"
            },
            mock
        );
        assert.deepStrictEqual(mock.lastCall, {
            brand: "swear",
            filter_operator: "$or",
            limit: 0,
            skip: 0,
            sort: null
        });
    });

    it("should allow filters", () => {
        const mock = new MockCollection();
        yonius.find(
            {
                find_d: ["nr1:gt:5", "nr2:lt:10"],
                filter_operator: "$and"
            },
            mock
        );
        assert.deepStrictEqual(mock.lastCall, {
            nr1: { $gt: "5" },
            nr2: { $lt: "10" },
            filter_operator: "$and",
            limit: 0,
            skip: 0,
            sort: null
        });
    });

    it("should allow likei", () => {
        const mock = new MockCollection();
        yonius.find(
            {
                find_d: "brand:likei:swear",
                filter_operator: "$or"
            },
            mock
        );
        assert.deepStrictEqual(mock.lastCall, {
            brand: {
                $options: "-i",
                $regex: "swear"
            },
            filter_operator: "$or",
            limit: 0,
            skip: 0,
            sort: null
        });
    });

    it("should allow pages and sorting", () => {
        const mock = new MockCollection();
        yonius.find(
            {
                find_d: "brand:likei:swear",
                filter_operator: "$or",
                skip: 5,
                limit: 10,
                sort: ["name", 1]
            },
            mock
        );
        assert.deepStrictEqual(mock.lastCall, {
            brand: {
                $options: "-i",
                $regex: "swear"
            },
            filter_operator: "$or",
            limit: 10,
            skip: 5,
            sort: ["name", 1]
        });
    });
});
