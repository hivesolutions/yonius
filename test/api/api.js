const assert = require("assert");
const yonius = require("../..");

const httpbinHost = process.env.HTTPBIN ? process.env.HTTPBIN : "httpbin.stage.hive.pt";
const httpbinUrl = `https://${httpbinHost}/`;

describe("API", function() {
    this.timeout(30000);
    describe("#constructor()", function() {
        it("should be able to construct a new API instance", () => {
            const api = new yonius.API();
            assert.notStrictEqual(api, null);
            assert.notStrictEqual(api, undefined);
        });
    });
    describe("#get()", function() {
        it("should be able to run a simple get", async () => {
            let result;
            const api = new yonius.API();

            result = await api.get(httpbinUrl + "ip");
            assert.notStrictEqual(result.origin, null);
            assert.notStrictEqual(result.origin, undefined);

            result = await api.get(httpbinUrl + "get", {
                params: { hello: "world" }
            });
            assert.deepStrictEqual(result.args, { hello: "world" });

            result = await api.get(httpbinUrl + "get", {
                params: { hello: "world" },
                headers: { hello: "world" }
            });
            assert.deepStrictEqual(result.args, { hello: "world" });
            assert.strictEqual(result.headers.Hello, "world");
        });

        it("should be able to run an HTML get", async () => {
            const api = new yonius.API();
            const result = await api.get(httpbinUrl + "html");
            assert.strictEqual(typeof result, "string");
        });
    });
    describe("#post()", function() {
        it("should be able to run a simple post", async () => {
            let result;
            const api = new yonius.API();

            result = await api.post(httpbinUrl + "post", {
                params: { hello: "world" }
            });
            assert.deepStrictEqual(result.form, { hello: "world" });

            result = await api.post(httpbinUrl + "post", { data: "hello world" });
            assert.strictEqual(result.data, "hello world");

            result = await api.post(httpbinUrl + "post", {
                dataJ: { hello: "world" }
            });
            assert.deepStrictEqual(result.json, { hello: "world" });
        });
    });

    describe("#_encodeMultipart()", function() {
        beforeEach(function() {
            if (typeof TextEncoder === "undefined" || typeof TextDecoder === "undefined") {
                this.skip();
            }
        });

        it("should be able to encode simple multipart values", async () => {
            let contentType, body;

            const api = new yonius.API();

            [contentType, body] = api._encodeMultipart({
                file: new TextEncoder("utf-8").encode("Hello World")
            });

            assert.strictEqual(
                contentType,
                "multipart/form-data; boundary=Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs"
            );
            assert.strictEqual(
                new TextDecoder("utf-8").decode(body),
                "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs\r\n" +
                    'Content-Disposition: form-data; name="file"\r\n' +
                    "\r\n" +
                    "Hello World\r\n" +
                    "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs--\r\n" +
                    "\r\n"
            );

            [contentType, body] = api._encodeMultipart({
                file: ["hello.txt", "text/plain", new TextEncoder("utf-8").encode("Hello World")]
            });

            assert.strictEqual(
                contentType,
                "multipart/form-data; boundary=Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs"
            );
            assert.strictEqual(
                new TextDecoder("utf-8").decode(body),
                "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs\r\n" +
                    'Content-Disposition: form-data; name="file"; filename="hello.txt"\r\n' +
                    "Content-Type: text/plain\r\n" +
                    "\r\n" +
                    "Hello World\r\n" +
                    "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs--\r\n" +
                    "\r\n"
            );

            [contentType, body] = api._encodeMultipart({
                file: ["hello.txt", "text/plain", new TextEncoder("utf-8").encode("Hello World")],
                message: {
                    data: new TextEncoder("utf-8").encode("Hello Message"),
                    Header1: "header1-value",
                    Header2: "header2-value"
                }
            });

            assert.strictEqual(
                contentType,
                "multipart/form-data; boundary=Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs"
            );
            assert.strictEqual(
                new TextDecoder("utf-8").decode(body),
                "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs\r\n" +
                    'Content-Disposition: form-data; name="file"; filename="hello.txt"\r\n' +
                    "Content-Type: text/plain\r\n" +
                    "\r\n" +
                    "Hello World\r\n" +
                    "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs\r\n" +
                    "Header1: header1-value\r\n" +
                    "Header2: header2-value\r\n" +
                    "\r\n" +
                    "Hello Message\r\n" +
                    "--Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs--\r\n" +
                    "\r\n"
            );
        });
    });
});
