import { ensurePermissions } from "../base";

export const ensureExpress = token => {
    return async (req, res, next) => {
        try {
            await ensurePermissions(token, req);
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default ensureExpress;
