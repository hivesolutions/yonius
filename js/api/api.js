import { Observable } from "./observable";
import { verify, urlEncode, globals } from "../util";
import fetch from "node-fetch";

const AUTH_ERRORS = [401, 403, 440, 499];

export class API extends Observable {
    constructor(kwargs = {}) {
        super();
        this.kwargs = kwargs;
    }

    async build(method, url, options = {}) {}

    async authCallback(params, headers) {}

    async get(url, options = {}) {
        const result = await this.methodBasic("GET", url, options);
        return result;
    }

    async post(url, options = {}) {
        const result = await this.methodPayload("POST", url, options);
        return result;
    }

    async put(url, options = {}) {
        const result = await this.methodPayload("PUT", url, options);
        return result;
    }

    async delete(url, options = {}) {
        const result = await this.methodBasic("DELETE", url, options);
        return result;
    }

    async patch(url, options = {}) {
        const result = await this.methodPayload("PATCH", url, options);
        return result;
    }

    async options(url, options = {}) {
        const result = await this.methodBasic("OPTIONS", url, options);
        return result;
    }

    async methodBasic(method, url, options = {}) {
        options.params = options.params !== undefined ? options.params : {};
        options.headers = options.headers !== undefined ? options.headers : {};
        try {
            return await this._methodBasic(method, url, options);
        } catch (err) {
            if (AUTH_ERRORS.includes(err.code)) {
                await this.authCallback(options.params, options.headers);
                return await this._methodBasic(method, url, options);
            } else {
                throw err;
            }
        }
    }

    async methodPayload(method, url, options = {}) {
        options.params = options.params !== undefined ? options.params : {};
        options.headers = options.headers !== undefined ? options.headers : {};
        try {
            return await this._methodPayload(method, url, options);
        } catch (err) {
            if (AUTH_ERRORS.includes(err.code)) {
                await this.authCallback(options.params, options.headers);
                return await this._methodPayload(method, url, options);
            } else {
                throw err;
            }
        }
    }

    async _methodBasic(method, url, options = {}) {
        const params = options.params !== undefined ? options.params : {};
        const headers = options.headers !== undefined ? options.headers : {};
        const kwargs = options.kwargs !== undefined ? options.kwargs : {};
        const handle = options.handle !== undefined ? options.handle : true;
        const getAgent = options.getAgent !== undefined ? options.getAgent : undefined;
        await this.build(method, url, {
            params: params,
            headers: headers,
            kwargs: kwargs
        });
        const query = urlEncode(params || {});
        if (query) url += url.includes("?") ? "&" + query : "?" + query;
        const response = await fetch(url, {
            method: method,
            headers: headers || {},
            agent: getAgent || globals.getAgent || undefined
        });
        const result = handle ? await this._handleResponse(response) : response;
        return result;
    }

    async _methodPayload(method, url, options = {}) {
        const params = options.params !== undefined ? options.params : {};
        let headers = options.headers !== undefined ? options.headers : {};
        let data = options.data !== undefined ? options.data : null;
        const dataJ = options.dataJ !== undefined ? options.dataJ : null;
        const dataM = options.dataM !== undefined ? options.dataM : null;
        let mime = options.mime !== undefined ? options.mime : null;
        const kwargs = options.kwargs !== undefined ? options.kwargs : {};
        const handle = options.handle !== undefined ? options.handle : true;
        const getAgent = options.getAgent !== undefined ? options.getAgent : undefined;

        await this.build(method, url, {
            params: params,
            headers: headers,
            data: data,
            dataJ: dataJ,
            dataM: dataM,
            mime: mime,
            kwargs: kwargs
        });

        const query = urlEncode(params || {});

        if (data !== null) {
            if (query) url += url.includes("?") ? "&" + query : "?" + query;
        } else if (dataJ !== null) {
            data = JSON.stringify(dataJ);
            if (query) url += url.includes("?") ? "&" + query : "?" + query;
            mime = mime || "application/json";
        } else if (dataM !== null) {
            if (query) url += url.includes("?") ? "&" + query : "?" + query;
            [mime, data] = this._encodeMultipart(dataM, mime, true);
        } else if (query) {
            data = query;
            mime = mime || "application/x-www-form-urlencoded";
        }

        headers = Object.assign({}, headers);
        if (mime) headers["Content-Type"] = mime;

        const response = await fetch(url, {
            method: method,
            headers: headers || {},
            body: data,
            agent: getAgent || global.getAgent || undefined
        });
        const result = handle ? await this._handleResponse(response) : response;
        return result;
    }

    async _handleResponse(response, errorMessage = "Problem in request") {
        let result = null;
        if (
            response.headers.get("content-type") &&
            response.headers.get("content-type").toLowerCase().startsWith("application/json")
        ) {
            result = await response.json();
        } else if (
            response.headers.get("content-type") &&
            response.headers.get("content-type").toLowerCase().startsWith("text/")
        ) {
            result = await response.text();
        } else {
            result = await response.blob();
        }
        verify(response.ok, result.error || errorMessage, response.status || 500);
        return result;
    }

    _encodeMultipart(fields, mime = null, doseq = false) {
        mime = mime || "multipart/form-data";

        const boundary = this._createBoundary(fields, undefined, doseq);

        const encoder = new TextEncoder("utf-8");

        const buffer = [];

        for (let [key, values] of Object.entries(fields)) {
            const isList = doseq && Array.isArray(values);
            values = isList ? values : [values];

            for (let value of values) {
                if (value === null) continue;

                let header;

                if (
                    typeof value === "object" &&
                    !Array.isArray(value) &&
                    value.constructor !== Uint8Array
                ) {
                    const headerL = [];
                    let data = null;
                    for (const [key, item] of Object.entries(value)) {
                        if (key === "data") data = item;
                        else headerL.push(`${key}: ${item}`);
                    }
                    value = data;
                    header = headerL.join("\r\n");
                } else if (Array.isArray(value)) {
                    let name = null;
                    let contents = null;
                    let contentTypeD = null;
                    if (value.length === 2) [name, contents] = value;
                    else [name, contentTypeD, contents] = value;
                    header = `Content-Disposition: form-data; name="${key}"; filename="${name}"`;
                    if (contentTypeD) header += `\r\nContent-Type: ${contentTypeD}`;
                    value = contents;
                } else {
                    header = `Content-Disposition: form-data; name="${key}"`;
                    value = value.constructor === Uint8Array ? value : encoder.encode(value);
                }

                buffer.push(encoder.encode("--" + boundary + "\r\n"));
                buffer.push(encoder.encode(header + "\r\n"));
                buffer.push(encoder.encode("\r\n"));
                buffer.push(value);
                buffer.push(encoder.encode("\r\n"));
            }
        }

        buffer.push(encoder.encode("--" + boundary + "--\r\n"));
        buffer.push(encoder.encode("\r\n"));
        const body = this._joinBuffer(buffer);
        const contentType = `${mime}; boundary=${boundary}`;

        return [contentType, body];
    }

    _createBoundary(fields, size = 32, doseq = false) {
        return "Vq2xNWWHbmWYF644q9bC5T2ALtj5CynryArNQRXGYsfm37vwFKMNsqPBrpPeprFs";
    }

    _joinBuffer(bufferArray) {
        const bufferSize = bufferArray.map(item => item.byteLength).reduce((a, v) => a + v, 0);
        const buffer = new Uint8Array(bufferSize);
        let offset = 0;
        for (const item of bufferArray) {
            buffer.set(item, offset);
            offset += item.byteLength;
        }
        return buffer;
    }
}

export const buildGetAgent = (AgentHttp, AgentHttps, set = true, options = {}) => {
    const httpAgent = new AgentHttp({
        keepAlive: options.keepAlive === undefined ? true : options.keepAlive,
        keepAliveMsecs: options.keepAliveMsecs || 120000,
        timeout: options.timeout || 60000,
        scheduling: options.scheduling || "fifo"
    });
    const httpsAgent = new AgentHttps({
        keepAlive: options.keepAlive === undefined ? true : options.keepAlive,
        keepAliveMsecs: options.keepAliveMsecs || 120000,
        timeout: options.timeout || 60000,
        scheduling: options.scheduling || "fifo"
    });
    const getAgent = parsedURL => (parsedURL.protocol === "http:" ? httpAgent : httpsAgent);
    if (set) globals.getAgent = getAgent;
    return getAgent;
};

/**
 * Tries to patch the global environment with a proper `getAgent`
 * function that can handle HTTP and HTTP connection polling.
 *
 * This can only be performed in a node.js environment (uses `require`).
 *
 * @returns {Function} The `getAgent` function that has just been
 * built and set in the globals.
 */
export const patchAgent = () => {
    if (typeof require !== "function") return;
    if (globals.getAgent) return;
    let http, https;
    try {
        http = require("http");
        https = require("https");
    } catch (err) {
        return;
    }
    if (!http || !https) return;
    if (!http.Agent || !https.Agent) return;
    return buildGetAgent(http.Agent, https.Agent, true);
};

// patches the global agent if possible, using the
// global dynamic require statements
patchAgent();

export default API;
