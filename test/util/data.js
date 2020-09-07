const assert = require("assert");
const yonius = require("../..");

describe("#getDataObject()", function() {
    it("should allow filter object", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                {
                    filters: ["brand:likei:swear"],
                    filter_operator: "$or"
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                find_o: "$or",
                find_d: ["brand:likei:swear"],
                limit: 50,
                skip: 0
            }
        );
    });

    it("should allow filter", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                {
                    "filters[]": "brand:likei:swear"
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                find_d: ["brand:likei:swear"],
                limit: 50,
                skip: 0
            }
        );
    });

    it("should allow multiple filters", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                {
                    "filters[]": ["brand:likei:swear", "model:likei:vyner", "owner:likei:myself"]
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                find_d: ["brand:likei:swear", "model:likei:vyner", "owner:likei:myself"],
                limit: 50,
                skip: 0
            }
        );
    });

    it("should allow ascending", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                { sort: "id:ascending" },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                limit: 50,
                skip: 0,
                sort: ["id", 1]
            }
        );
    });

    it("should allow descending", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                { sort: "id:descending" },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                limit: 50,
                skip: 0,
                sort: ["id", -1]
            }
        );
    });

    it("should allow page", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                { page: 2 },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                limit: 50,
                page: 2,
                skip: 50
            }
        );
    });

    it("should allow size", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                { size: 3 },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                limit: 3,
                size: 3,
                skip: 0
            }
        );
    });

    it("should allow page and size", () => {
        assert.deepStrictEqual(
            yonius.getDataObject(
                { page: 4, size: 3 },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                page: 4,
                limit: 3,
                size: 3,
                skip: 9
            }
        );
    });
});
