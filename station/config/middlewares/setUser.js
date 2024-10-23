import { verifyAccessToken, getAccessToken, verifyrefreshToken } from "../token/index.js";

export const setUser = async (req, res, next) => {
    const { access_token, refresh_token } = req.cookies;

    if (!access_token && !refresh_token) {
        return next();
    }

    if (access_token) {
        try {
            const userToken = await verifyAccessToken(access_token);
            req.user = userToken;
            return next();
        } catch (error) {
            console.error('Access token verification failed:', error);
        }
    }

    if (refresh_token) {
        try {
            const decodedRefresh = await verifyrefreshToken(refresh_token);
            const newAccessToken = getAccessToken({ id: decodedRefresh.id });
            res.cookie('access_token', newAccessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
            const user = await verifyAccessToken(newAccessToken);
            req.user = user;
            return next();
        } catch (error) {
            console.error('Refresh token verification failed:', error);
            res.clearCookie('access_token').clearCookie('refresh_token');
        }
    }

    return next();
};