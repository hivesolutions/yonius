import { ensurePermissions } from "../base";

export const ensureExpress = token => {
    return (req, res, next) => {
        ensurePermissions(token, req).catch(next).then(next);
    };
};

export default ensureExpress;
