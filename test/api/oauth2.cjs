const assert = require("assert");
const yonius = require("../..");

describe("OAuth2API", function() {
    describe("#constructor()", function() {
        it("should be able to construct a new OAuth2 API instance", () => {
            const api = new yonius.OAuth2API();
            assert.notStrictEqual(api, null);
            assert.notStrictEqual(api, undefined);
        });
    });
});
