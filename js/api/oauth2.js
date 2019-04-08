import { OAuthAPI } from "./oauth";

export class OAuth2API extends OAuthAPI {
    constructor(kwargs = {}) {
        super(kwargs);
        this.accessToken = null;
    }

    async build(method, url, options = {}) {
        await super.build(method, url, options);
        const params = options.params !== undefined ? options.params : {};
        const headers = options.headers !== undefined ? options.headers : {};
        const kwargs = options.kwargs !== undefined ? options.kwargs : {};
        const token = kwargs.token === undefined ? this.tokenDefault : kwargs.token;
        delete kwargs.token;
        if (token && this.oauthTypes.includes("param")) {
            params[this.oauthParam] = this.getAccessToken();
        }
        if (token && this.oauthTypes.includes("header")) {
            headers.Authorization = `Bearer ${this.getAccessToken()}`;
        }
    }

    getAccessToken() {
        if (this.accessToken) return this.accessToken;
        throw new Error("No access token found must re-authorize");
    }

    get oauthTypes() {
        return ["param", "header"];
    }

    get oauthParam() {
        return "access_token";
    }

    get tokenDefault() {
        return true;
    }
}

export default OAuth2API;
