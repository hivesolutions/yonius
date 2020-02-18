import { OperationalError } from "./error";

/**
 * Ensures that the current "session" context contains the
 * requested ACL token as valid.
 *
 * In case the validation fails an exception is raised
 * indicating the auth validation error.
 *
 * @param {String} token The ACL token to ensure permission,
 * the logged user should be allowed to id.
 * @param {Object} ctx The context object to be used in
 * the session basic ACL retrieval, should contain proper
 * injected methods for retrieval (eg: `getAcl`).
 */
export const ensurePermissions = async (token, ctx) => {
    // retrieves the ACL values from the current context and
    // then uses the ACL to obtain the valid expanded tokens map
    const acl = ctx.getAcl ? await ctx.getAcl(ctx) : {};
    const tokens = toTokensM(acl);

    // in case the permission validation test is not positive
    // then an exception should be raised indicating the issue
    if (!_hasPermission(token, tokens)) {
        throw new OperationalError("You don't have authorization to access this resource", 401);
    }
};

/**
 * Converts the provided list of token strings separated by dots
 * into a map based representation on an hierarchical structure.
 *
 * @param {Array} tokens A linear array of tokens to convert into
 * an hierarchical representation.
 * @returns {Object} The map containing the hierarchy of tokens
 * for the provided linear string based sequence of tokens.
 */
export const toTokensM = tokens => {
    const tokensM = {};

    if (tokens === undefined) return tokensM;
    if (tokens === null) return tokensM;
    if (!Array.isArray(tokens)) return tokensM;

    for (const token of tokens) {
        let tokensC = tokensM;
        const tokenL = token.split(".");
        const head = tokenL.slice(0, tokenL.length - 1);
        const tail = tokenL[tokenL.length - 1];

        for (const tokenP of head) {
            let current = tokensC[tokenP] || {};
            const isDict = typeof current === "object";
            if (!isDict) current = { _: current };
            tokensC[tokenP] = current;
            tokensC = current;
        }

        const leaf = tokensC[tail] || null;
        if (leaf && typeof leaf === "object") leaf._ = true;
        else tokensC[tail] = true;
    }

    return tokensM;
};

const _hasPermission = (token, tokensM = null) => {
    if (!token) return true;
    if (tokensM === undefined || tokensM === null) return false;

    const tokenL = token.split(".");
    for (const tokenP of tokenL) {
        if (typeof tokensM !== "object") return false;
        if (tokensM["*"]) return true;
        if (tokensM[tokenP] === undefined) return false;
        tokensM = tokensM[tokenP];
    }

    const isDict = typeof tokensM === "object";
    const result = isDict ? tokensM._ || false : tokensM;

    return Boolean(result);
};

export default ensurePermissions;
