const assert = require("assert");
const yonius = require("../..");

describe("#getObject()", function() {
    it("should allow filter object", () => {
        assert.deepStrictEqual(
            yonius.getObject(
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
            yonius.getObject(
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
            yonius.getObject(
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
            yonius.getObject(
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
                sort: [["id", 1]]
            }
        );
    });

    it("should allow descending", () => {
        assert.deepStrictEqual(
            yonius.getObject(
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
                sort: [["id", -1]]
            }
        );
    });

    it("should allow page", () => {
        assert.deepStrictEqual(
            yonius.getObject(
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
            yonius.getObject(
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
            yonius.getObject(
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

    it("should handle sorter and direction", () => {
        assert.deepStrictEqual(
            yonius.getObject(
                {
                    sorter: "name",
                    direction: "ascending"
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                sorter: "name",
                direction: "ascending",
                limit: 50,
                skip: 0,
                sort: [["name", 1]]
            }
        );

        assert.deepStrictEqual(
            yonius.getObject(
                {
                    sorter: "price",
                    direction: "descending"
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                sorter: "price",
                direction: "descending",
                limit: 50,
                skip: 0,
                sort: [["price", -1]]
            }
        );

        assert.deepStrictEqual(
            yonius.getObject(
                {
                    sorter: "id"
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                sorter: "id",
                limit: 50,
                skip: 0,
                sort: [["id", -1]]
            }
        );
    });

    it("should handle default sort", () => {
        assert.deepStrictEqual(
            yonius.getObject(
                {
                    sort: "default"
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                limit: 50,
                skip: 0,
                sort: null
            }
        );
    });

    it("should handle empty array parameters", () => {
        assert.deepStrictEqual(
            yonius.getObject(
                {
                    "filters[]": []
                },
                {
                    alias: true,
                    page: true,
                    find: true
                }
            ),
            {
                find_d: [],
                limit: 50,
                skip: 0
            }
        );
    });
});
