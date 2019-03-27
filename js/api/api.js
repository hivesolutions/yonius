import { Observable } from "./observable";
import { urlEncode } from "../util";
import fetch from "node-fetch";

export class API extends Observable {
    async build(method, url, options = {}) {}

    async get(url, options = {}) {
        let params = options.params !== undefined ? options.params : {};
        let headers = options.headers !== undefined ? options.headers : {};
        let kwargs = options.kwargs !== undefined ? options.kwargs : {};
        let handle = options.handle !== undefined ? options.handle : true;
        this.build("GET", url, {
            params: params,
            headers: headers,
            kwargs: kwargs
        });
        const query = urlEncode(params || {});
        if (query) url += url.includes("?") ? "&" + query : "?" + query;
        const response = await fetch(url, {
            method: "GET",
            headers: headers || {}
        });
        const result = handle ? await this._handleResponse(response) : response;
        return result;
    }

    async post(url, options = {}) {
        let params = options.params !== undefined ? options.params : {};
        let headers = options.headers !== undefined ? options.headers : {};
        let data = options.data !== undefined ? options.data : null;
        let dataJ = options.dataJ !== undefined ? options.dataJ : null;
        let dataM = options.dataM !== undefined ? options.dataM : null;
        let mime = options.mime !== undefined ? options.mime : null;
        let kwargs = options.kwargs !== undefined ? options.kwargs : null;
        let handle = options.handle !== undefined ? options.handle : true;

        this.build("POST", url, {
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
            method: "POST",
            headers: headers || {},
            body: data
        });
        const result = handle ? await this._handleResponse(response) : response;
        return result;
    }

    async _handleResponse(response) {
        let result = null;
        if (response.headers.get("content-type").toLowerCase() === "application/json") {
            result = await response.json();
        } else {
            result = await response.blob();
        }
        return result;
    }
}

export default API;
