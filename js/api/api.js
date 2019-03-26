import { Observable } from "./observable";
import { urlEncode } from "../util";
import fetch from "node-fetch";

export class API extends Observable {
    async get(
        url,
        params = null,
        headers = null,
        kwargs = {}
    ) {
        const handle = kwargs.handle !== undefined ? kwargs.handle : true;
        const query = urlEncode(params || {});
        if (query) url += url.includes("?") ? "&" + query : "?" + query;
        const response = await fetch(url, {
            method: "GET",
            headers: headers || {}
        });
        const result = handle ? await this._handleResponse(response) : response;
        return result;
    }

    async post(
        url,
        params = null,
        data = null,
        dataJ = null,
        dataM = null,
        headers = null,
        mime = null,
        extra = {}
    ) {
        const handle = extra.handle !== undefined ? extra.handle : true;
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
