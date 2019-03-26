import { Observable } from "./observable";
import fetch from "node-fetch";

export class API extends Observable {
    async get(
        url,
        headers = null,
        params = null,
        handle = null,
        silent = null,
        redirect = null,
        timeout = null,
        callback = null,
        extra = null
    ) {
        const response = await fetch(url, {
            method: "GET",
            headers: headers || {}
        });
        const result = await this._handleResponse(response);
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
