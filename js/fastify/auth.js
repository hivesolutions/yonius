import { ensurePermissions } from "../base";

export const ensureFastify = (token, { skipAuth = false } = {}) => {
    return (req, res, next) => {
        if (skipAuth) return next();
        ensurePermissions(token, req).catch(next).then(next);
    };
};

export default ensureFastify;
