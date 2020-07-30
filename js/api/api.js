import { Observable } from "./observable";
import { verify, urlEncode } from "../util";
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
        await this.build(method, url, {
            params: params,
            headers: headers,
            kwargs: kwargs
        });
        const query = urlEncode(params || {});
        if (query) url += url.includes("?") ? "&" + query : "?" + query;
        const response = await fetch(url, {
            method: method,
            headers: headers || {}
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
        } else if (query) {
            data = query;
            mime = mime || "application/x-www-form-urlencoded";
        }

        headers = Object.assign({}, headers);
        if (mime) headers["Content-Type"] = mime;

        const response = await fetch(url, {
            method: method,
            headers: headers || {},
            body: data
        });
        const result = handle ? await this._handleResponse(response) : response;
        return result;
    }

    async _handleResponse(response, errorMessage = "Problem in request") {
        let result = null;
        if (response.headers.get("content-type").toLowerCase().startsWith("application/json")) {
            result = await response.json();
        } else {
            result = await response.blob();
        }
        verify(response.ok, result.error || errorMessage, response.status || 500);
        return result;
    }
}

export default API;
