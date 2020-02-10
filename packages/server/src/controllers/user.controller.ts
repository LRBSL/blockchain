import { Request, Response } from 'express';
import { identity_config, updateSecurityConfig, security_config } from '../config';
import { backends, createAdapter, initServerIdentity, checkCryptographicMaterials, createBCAdapter, initServerIdentityForBC, checkCryptographicMaterialsForBC } from '../convector';
import { ClientFactory } from '@worldsibu/convector-core';
import * as Fabric_Client from 'fabric-client';
import * as Fabric_CA_Client from 'fabric-ca-client';
import { LandController } from 'land-cc';
import { getAuthUser, setAuthUser, deleteAuthUser, generateAuthUserIdentityName } from './database.controller';
import { checkBodyParams, checkAdminPriviledges } from './utils';

import * as httpStatusCodes from 'http-status-codes';

import IController from '../types/IController';
import userService from '../services/user.service';
import { generateCookie, verifyCookie, generateHash } from '../utils/encrytionUtils';
import constants from '../constants';
import apiResponse from '../utils/apiResponse';
import locale from '../constants/locale';
import logger from '../config/logger';
import bcUserService from '../services/bcUser.service';
import { extractCookieFromRequest, extractBCCookiesFromRequest } from '../utils/apiUtils';
import Constants from '../constants';
import { getKeyStore, getNetworkProfile } from '../utils/bcUtils';
import { ca_ports } from '../config/blockchain';
import { User } from '../entities/user/user.entity';
import { getRepository } from 'typeorm';
import { transporter } from '../config/nodemailler';

const fabric_client = new Fabric_Client();
let fabric_ca_client = null;
let admin_user = null;
let member_user = null;

// const homedir = require('os').homedir();

// user login function
// @body username, passwd
export async function LandController_login_post(req: Request, res: Response) {
    try {
        let curUser = null;
        let params = req.body;
        checkBodyParams([params.username, params.passwd]);

        await getAuthUser(params.username, params.passwd).then((result) => {
            curUser = result;
        }).catch((err) => {
            console.log(err);
        });

        if (curUser != null) {
            identity_config.identityName = curUser.identityName;
            identity_config.identityOrg = curUser.identityOrg;
            updateSecurityConfig();

            backends.adapter = createAdapter();
            backends.initAdapter = backends.adapter.init();
            backends.LandControllerBackEnd = ClientFactory(LandController, backends.adapter);

            // optional
            initServerIdentity().then(() => {
                checkCryptographicMaterials().then(() => {
                    res.status(200).send(JSON.stringify(curUser.username + " successfully logged"));
                });
            });
        } else {
            res.send(JSON.stringify("user credentials are invalid"));
        }
    } catch (ex) {
        console.log('Error post LandController_login', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

// user register function
// @body username, passwd
export async function LandController_register_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        let userId: string;
        checkBodyParams([params.username, params.passwd]);
        checkAdminPriviledges();
        generateAuthUserIdentityName(identity_config.identityOrg).then((result: string) => {
            userId = result;
        }).catch((err) => {
            throw new Error("Error occured in new user identity name generating process.")
        })

        setAuthUser({
            username: params.username,
            passwd: params.passwd,
            identityName: userId,
            identityOrg: identity_config.identityOrg
        }).then((result) => {
            Fabric_Client.newDefaultKeyValueStore({
                path: security_config.keyStore
            }).then((state_store) => {
                // assign the store to the fabric client
                fabric_client.setStateStore(state_store);
                const crypto_suite = Fabric_Client.newCryptoSuite();
                const crypto_store = Fabric_Client.newCryptoKeyStore({
                    path: security_config.keyStore
                });
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);
                // port number should change according to the org
                fabric_ca_client = new Fabric_CA_Client('http://localhost:' + ca_ports[identity_config.identityOrg], null, '', crypto_suite);
                return fabric_client.getUserContext('admin', true);
            }).then((user_from_store) => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded admin from persistence');
                    admin_user = user_from_store;
                } else {
                    throw new Error('Failed to get admin.... run enrollAdmin.js');
                }
                // at this point we should have the admin user
                // first need to register the user with the CA server
                return fabric_ca_client.register({
                    enrollmentID: userId,
                    attrs: [{
                        name: userId,
                        value: 'true',
                        ecert: true
                    }],
                    role: 'client'
                }, admin_user);
            }).then((secret) => {
                // next we need to enroll the user with CA server
                console.log('Successfully registered ' + userId + ' - secret:' + secret);
                return fabric_ca_client.enroll({
                    enrollmentID: userId,
                    enrollmentSecret: secret
                });
            }).then((enrollment) => {
                console.log('Successfully enrolled member user ' + userId);
                return fabric_client.createUser({
                    username: userId,
                    mspid: admin_user.getIdentity().getMSPId(),
                    cryptoContent: {
                        privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate
                    },
                    skipPersistence: true
                });
            }).then((user) => {
                member_user = user;
                return fabric_client.setUserContext(member_user);
            }).then(() => {
                console.log(userId + ' was successfully registered and enrolled and is ready to interact with the fabric network');
                res.send(JSON.stringify(userId + ' was successfully registered and enrolled'));
            }).catch((err) => {
                console.error('Failed to register: ' + err);
                if (err.toString().indexOf('Authorization') > -1) {
                    console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                        'Try again after deleting the contents of the store directory ' + security_config.keyStore);
                }
                deleteAuthUser(params.username).then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.log(err);
                });
            });
        }).catch((err) => {
            res.status(500).send('Error : ' + err.message);
        });
    } catch (ex) {
        console.log('Error post PersonController_register', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

// -------------------------------------------
export async function LandController_userLogin_post(req: Request, res: Response) {
    try {
        let curUser = null;
        let params = req.body;
        checkBodyParams([params.username, params.passwd]);

        await getAuthUser(params.username, params.passwd).then((result) => {
            curUser = result;
        }).catch((err) => {
            console.log(err);
        });

        if (curUser != null) {
            identity_config.identityName = curUser.identityName;
            identity_config.identityOrg = curUser.identityOrg;
            updateSecurityConfig();

            backends.adapter = createAdapter();
            backends.initAdapter = backends.adapter.init();
            backends.LandControllerBackEnd = ClientFactory(LandController, backends.adapter);

            // optional
            initServerIdentity().then(() => {
                checkCryptographicMaterials().then(() => {
                    res.status(200).send(JSON.stringify(curUser.username + " successfully logged"));
                });
            });
        } else {
            res.status(404).send(JSON.stringify("user credentials are invalid"));
        }
    } catch (ex) {
        console.log('Error post LandController_login', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }

    // if (req.session.page_views) {
    //     req.session.page_views++;
    //     res.send("You visited this page " + req.session.page_views + " times");
    // } else {
    //     req.session.page_views = 1;
    //     res.send("Welcome to this page for the first time!");
    // }
}

const loginBackend: IController = async (req, res) => {
    const user = await userService.loginUser(req.body.email, req.body.password);
    if (user) {
        const cookie = await generateUserCookie(user.id);
        apiResponse.result(res, user, httpStatusCodes.OK, cookie);
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, locale.INVALID_CREDENTIALS);
    }
};

const loginBlockchain_identityName: IController = async (req, res) => {
    const bcUser = bcUserService.getBcUserById(req.user.id);
    const cookie = generateBlockchainCookie("identityName", (await bcUser).identityName);
    apiResponse.result(res, null, httpStatusCodes.OK, cookie);
};

const loginBlockchain_identityOrg: IController = async (req, res) => {
    const bcUser = bcUserService.getBcUserById(req.user.id);
    const cookie = generateBlockchainCookie("identityOrg", (await bcUser).identityOrg);
    apiResponse.result(res, null, httpStatusCodes.OK, cookie);
};

const loginBlochain: IController = async (req, res) => {
    try {
        const data = extractBCCookiesFromRequest(req.headers.cookie);
        const identityName: string = data.identityName;
        const identityOrg: string = data.identityOrg;

        const keyStore: string = getKeyStore(identityOrg);
        const networkProfile: string = getNetworkProfile(identityOrg);

        const adapter = createBCAdapter(identityName, keyStore, networkProfile);
        await adapter.init();

        const landCtrlBackend = ClientFactory(LandController, adapter);

        // optional
        initServerIdentityForBC(landCtrlBackend).then(() => {
            checkCryptographicMaterialsForBC(keyStore, identityName).then(() => {
                apiResponse.result(res, { massage: "User successfully logged to the blockchain" }, httpStatusCodes.OK);
            });
        });

    } catch (ex) {
        apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
    }
};

const register: IController = async (req, res) => {

    let user;
    try {
        user = await userService.createUser(req.body.email, req.body.password, req.body.type, req.body.regId);
    } catch (e) {
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST,
                locale.EMAIL_ALREADY_EXISTS);
            return;
        }
    }
    if (user) {
        const cookie = await generateUserCookie(user.id);
        apiResponse.result(res, user, httpStatusCodes.CREATED, cookie);
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
};

const registerNotary: IController = async (req, res) => {
    try {
        const keyStore: string = getKeyStore("org3");
        const newIdentityName = await bcUserService.generateNewUserIdentityName("org3");

        Fabric_Client.newDefaultKeyValueStore({
            path: keyStore
        }).then((state_store) => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            const crypto_suite = Fabric_Client.newCryptoSuite();
            const crypto_store = Fabric_Client.newCryptoKeyStore({
                path: keyStore
            });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);
            // port number should change according to the org
            fabric_ca_client = new Fabric_CA_Client('http://localhost:' + ca_ports["org3"], null, '', crypto_suite);
            return fabric_client.getUserContext('admin', true);
        }).then((user_from_store) => {
            let admin_user;
            if (user_from_store && user_from_store.isEnrolled()) {
                logger.info('Successfully loaded admin from persistence');
                admin_user = user_from_store;
            } else {
                throw new Error('Failed to get admin.... run enrollAdmin.js');
            }
            // at this point we should have the admin user
            // first need to register the user with the CA server
            return fabric_ca_client.register({
                enrollmentID: newIdentityName,
                attrs: [{
                    name: newIdentityName,
                    value: 'true',
                    ecert: true
                }],
                role: 'client'
            }, admin_user);
        }).then((secret) => {
            // next we need to enroll the user with CA server
            logger.info('Successfully registered ' + newIdentityName + ' - secret:' + secret);
            return fabric_ca_client.enroll({
                enrollmentID: newIdentityName,
                enrollmentSecret: secret
            });
        }).then((enrollment) => {
            logger.info('Successfully enrolled member user ' + newIdentityName);
            return fabric_client.createUser({
                username: newIdentityName,
                mspid: 'org3MSP',
                cryptoContent: {
                    privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate
                },
                skipPersistence: true
            });
        }).then((user) => {
            return fabric_client.setUserContext(user);
        }).then(async () => {
            const newUser = new User();
            newUser.email = req.body.notary.email;
            newUser.password = await generateHash(req.body.notary.email, 10);
            newUser.type = "notary";
            newUser.regId = req.body.notary.regId;
            newUser.firstName = req.body.notary.fname;
            newUser.lastName = req.body.notary.lname;
            newUser.nic = req.body.notary.nic;
            let savUser = await getRepository(User).save(newUser);

            bcUserService.createBcUser(savUser, newIdentityName, "org3");

            let mailOptions = {
                from: 'rstmpgd1@gmail.com',
                to: req.body.notary.email,
                subject: 'Notary User Registration',
                text: 'You have been registered as a notary in LRBSL system. Your current password is your email. You can change it by logging the system'
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    logger.info(error);
                } else {
                    logger.info('Email sent: ' + info.response);
                }
            });

            logger.info(newIdentityName + ' was successfully registered and enrolled and is ready to interact with the fabric network');
            apiResponse.result(res, { message: newIdentityName + ' was successfully registered and enrolled' }, httpStatusCodes.CREATED);
        }).catch((err) => {
            logger.info('Failed to register: ' + err);
            if (err.toString().indexOf('Authorization') > -1) {
                logger.info('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                    'Try again after deleting the contents of the store directory ' + security_config.keyStore);
            }
        });
    } catch (ex) {
        apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
    }
};

const self: IController = async (req, res) => {
    const cookie = await generateUserCookie(req.user.id);
    apiResponse.result(res, req.user, httpStatusCodes.OK, cookie);
};

const generateUserCookie = async (userId: number) => {
    return {
        key: constants.Cookie.COOKIE_USER,
        value: await generateCookie(constants.Cookie.KEY_USER_ID, userId.toString()),
    };
};

const generateBlockchainCookie = (key: string, value: string) => {
    return {
        key: key,
        value: value,
    };
};

var landControllerBackEnd = async (req: any) => {
    const decoded = await verifyCookie(extractCookieFromRequest(req, Constants.Cookie.COOKIE_USER));

    const identityName: string = decoded.data[Constants.Cookie.KEY_IDENTITY_NAME];
    const identityOrg: string = decoded.data[Constants.Cookie.KEY_IDENTITY_ORG];
    const keyStore: string = getKeyStore(identityOrg);
    const networkProfile: string = getNetworkProfile(identityOrg);

    const adapter = createBCAdapter(identityName, keyStore, networkProfile);
    await adapter.init();

    return ClientFactory(LandController, adapter);
}

export default {
    register,
    loginBackend,
    loginBlockchain_identityName,
    loginBlockchain_identityOrg,
    loginBlochain,
    registerNotary,
    self,
};