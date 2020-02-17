import * as express from 'express';
import * as httpStatusCodes from 'http-status-codes';

import userService from '../services/user.service';
import apiResponse from '../utils/apiResponse';
import { verifyCookie } from '../utils/encrytionUtils';
import { extractCookieFromRequest } from '../utils/apiUtils';
import application from '../constants/application';
import Constants from '../constants';
import IRequest from '../types/IRequest';
import logger from '../config/logger';

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

export default async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    if (application.authorizationIgnorePath
        .indexOf(`${req.originalUrl}`) === -1) {
        const authorizationHeader = extractCookieFromRequest(req, Constants.Cookie.COOKIE_USER);
        if (authorizationHeader) {
            const decoded = await verifyCookie(authorizationHeader);
            if (decoded) {
                const user = await userService.getAuthUserById(decoded.data[Constants.Cookie.KEY_USER_ID]);
                if (user) {
                    // @ts-ignore
                    req.user = user;
                    // req.dashboard = req.headers['context'] === 'dashboard' && user.isStaff;
                } else {
                    apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
                    return;
                }
            } else {
                apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
                return;
            }
        } else {
            apiResponse.error(res, httpStatusCodes.FORBIDDEN);
            return;
        }
    }

    next();
};