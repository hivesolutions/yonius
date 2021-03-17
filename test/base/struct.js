const assert = require("assert");
const yonius = require("../../");

describe("FileTuple", function() {
    describe("#fromData()", async function() {
        it("should be able to create a simple file tuple objects", () => {
            const fileTuple = yonius.FileTuple.fromData(
                new Uint8Array(),
                "hello.txt",
                "text/plain"
            );
            assert.notStrictEqual(fileTuple, null);
            assert.strictEqual(fileTuple.constructor, yonius.FileTuple);
            assert.strictEqual(fileTuple.name, "hello.txt");
            assert.strictEqual(fileTuple.mime, "text/plain");
            assert.strictEqual(fileTuple.data.byteLength, 0);
            assert.strictEqual(fileTuple instanceof yonius.FileTuple, true);
            assert.strictEqual(fileTuple instanceof Array, true);
            assert.strictEqual(Array.isArray(fileTuple), true);
        });
    });
});
