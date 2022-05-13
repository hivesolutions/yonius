const assert = require("assert");
const yonius = require("../../");

const { Blob } = require("buffer");

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

    describe("#fromString()", async function() {
        beforeEach(function() {
            if (typeof TextEncoder === "undefined") {
                this.skip();
            }
        });

        it("should be able to create a simple file tuple objects", () => {
            const fileTuple = yonius.FileTuple.fromString("hello", "hello.txt", "text/plain");
            assert.notStrictEqual(fileTuple, null);
            assert.strictEqual(fileTuple.constructor, yonius.FileTuple);
            assert.strictEqual(fileTuple.name, "hello.txt");
            assert.strictEqual(fileTuple.mime, "text/plain");
            assert.strictEqual(fileTuple.data.byteLength, 5);
            assert.strictEqual(fileTuple instanceof yonius.FileTuple, true);
            assert.strictEqual(fileTuple instanceof Array, true);
            assert.strictEqual(Array.isArray(fileTuple), true);
        });
    });

    describe("#fromArrayBuffer()", async function() {
        it("should be able to create a simple file tuple objects", () => {
            const fileTuple = yonius.FileTuple.fromArrayBuffer(
                new ArrayBuffer(),
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

    describe("#fromBlob()", async function() {
        beforeEach(function() {
            if (typeof Blob === "undefined") {
                this.skip();
            }
        });

        it("should be able to create a simple file tuple objects", async () => {
            const fileTuple = await yonius.FileTuple.fromBlob(
                new Blob(),
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
