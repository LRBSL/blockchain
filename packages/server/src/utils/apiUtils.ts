import { NextFunction, Request, Response } from 'express';
import * as HttpStatusCode from 'http-status-codes';

import { User } from '../entities/user/user.entity';
import IRequest from '../types/IRequest';
import ApiResponse from './apiResponse';
import logger from '../config/logger';

const extractUserIdFromRequest = (req: IRequest) => {
    return req.user.id;
};

const extractQueryForRequest = (req: Request, query: string) => {
    if (req.query[query]) {
        return JSON.parse(req.query[query]);
    }
    return [];
};

const extractCookieFromRequest = (req: Request, key: string) => {
    if (req.headers.authorization) {
        return req.headers.authorization;
    }
    if (req.headers.cookie) {
        const results = req.headers.cookie.toString().split(';');
        const filtered = results.filter((result) => {
            return result.startsWith(`${key}=`);
        });
        if (filtered.length > 0) {
            return filtered[0].split('=')[1];
        }
    }
    return null;
};

const extractBCCookiesFromRequest = (cookie: string) => {
    const cok = cookie.split(';');
    const result = {
        identityName: cok[1].split("=")[1],
        identityOrg: cok[2].split("=")[1],
    }
    return result;
};

const sanitizeUser = (user: User) => {
    const { password, ...userWithOutPassword } = user;
    return userWithOutPassword;
};

// const restrictToStaff = (req: IRequest, res: Response, next: NextFunction) => {
//     if (!req.user.isStaff) {
//         ApiResponse.error(res, HttpStatusCode.FORBIDDEN);
//         return;
//     }
//     next();
// };

export {
    extractUserIdFromRequest,
    extractQueryForRequest,
    sanitizeUser,
    extractCookieFromRequest,
    extractBCCookiesFromRequest
};