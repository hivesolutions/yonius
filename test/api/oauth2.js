const assert = require("assert");
const ripe = require("../..");

describe("OAuth2API", function() {
    describe("#constructor()", function() {
        it("should be able to contruct a new OAuth2 API instance", () => {
            const api = new ripe.OAuth2API();
            assert.notStrictEqual(api, null);
            assert.notStrictEqual(api, undefined);
        });
    });
});
