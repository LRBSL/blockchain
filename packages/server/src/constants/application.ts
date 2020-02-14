const base = '/api';

export default {
    url: {
        base,
    },
    timers: {
        userCookieExpiry: '720h',
    },
    env: {
        authSecret: process.env.TOKEN_SECRET_KEY || 'test',
    },
    authorizationIgnorePath: [
        `${base}/user/auth/login-backend`,
        `${base}/user/auth/register`
    ],
};