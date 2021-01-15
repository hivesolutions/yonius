import { ensurePermissions } from "../base";

export const ensureFastify = token => {
    return (req, res, next) => {
        ensurePermissions(token, req).catch(next).then(next);
    };
};

export default ensureFastify;
