import application from '../constants/application';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const generateHash = async (password: string, saltRounds: number): Promise<string> =>
    new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: string, hash: string) => {
            if (!err) {
                resolve(hash);
            }
            reject(err);
        });
    });

const verifyHash = async (password: string, hash: string): Promise<boolean> =>
    new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hash, (err: any, result: string) => {
            if (result) {
                resolve(true);
            }
            resolve(false);
        });
    });

const generateCookie = async (key: string, value: string) => {
    const data: { [key: string]: string } = {};
    data[key] = value;
    return await jwt.sign({ data }, application.env.authSecret,
        { expiresIn: application.timers.userCookieExpiry });
};

const verifyCookie = async (token: string): Promise<any> =>
    new Promise((resolve) => {
        jwt.verify(token, application.env.authSecret, (err: Error, decoded: any) => {
            if (err) {
                resolve(null);
            } else {
                resolve(decoded);
            }
        });
    });

export {
    generateHash,
    verifyHash,
    generateCookie,
    verifyCookie,
};