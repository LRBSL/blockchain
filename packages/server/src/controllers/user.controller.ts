import { security_config } from '../config';
import { createBCAdapter, initServerIdentityForBC, checkCryptographicMaterialsForBC } from '../convector';
import { ClientFactory } from '@worldsibu/convector-core';
import * as Fabric_Client from 'fabric-client';
import * as Fabric_CA_Client from 'fabric-ca-client';
import { LandController } from 'land-cc';
import * as httpStatusCodes from 'http-status-codes';
import IController from '../types/IController';
import userService from '../services/user.service';
import { generateCookie, generateHash } from '../utils/encrytionUtils';
import constants from '../constants';
import apiResponse from '../utils/apiResponse';
import locale from '../constants/locale';
import logger from '../config/logger';
import bcUserService from '../services/bcUser.service';
import { extractBCCookiesFromRequest } from '../utils/apiUtils';
import { getKeyStore, getNetworkProfile } from '../utils/bcUtils';
import { User } from '../entities/user/user.entity';
import { getRepository } from 'typeorm';

const fabric_client = new Fabric_Client();
let fabric_ca_client = null;

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

const loginBlockchain: IController = async (req, res) => {
    try {
        const data = extractBCCookiesFromRequest(req.headers.cookie.toString());
        const identityName: string = data.identityName;
        const identityOrg: string = data.identityOrg;

        const keyStore: string = getKeyStore(identityOrg);
        const networkProfile: string = getNetworkProfile(identityOrg);

        const adapter = createBCAdapter(identityName, keyStore, networkProfile);
        console.log("adapter created")
        await adapter.init().then(() => {
            console.log("adapter initialized : ")
        }).catch((error) => {
            console.log(error)
        });

        const landCtrlBackend = ClientFactory(LandController, adapter);

        // optional
        initServerIdentityForBC(landCtrlBackend).then(() => {
            console.log("server idenitity")
            checkCryptographicMaterialsForBC(keyStore, identityName).then(() => {
                apiResponse.result(res, { massage: "User successfully logged to the blockchain" }, httpStatusCodes.OK);
            });
        });

    } catch (ex) {
        console.log("Error : " + ex.message)
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
            fabric_ca_client = new Fabric_CA_Client('http://ca.org3.hurley.lab:7054', null, '', crypto_suite);
            return fabric_client.getUserContext('admin', true);
        }).then(async (user_from_store) => {
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

            await bcUserService.createBcUser(savUser, newIdentityName, "org3");

            logger.info(newIdentityName + ' was successfully registered and enrolled and is ready to interact with the fabric network');
            apiResponse.result(res, { message: newIdentityName + ' was successfully registered and enrolled' }, httpStatusCodes.CREATED);
        }).catch((err) => {
            if (err.toString().indexOf('Authorization') > -1) {
                let errmsg = 'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                    'Try again after deleting the contents of the store directory ' + security_config.keyStore;
                apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, errmsg);
            }
            apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, err);
        });
    } catch (ex) {
        apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
    }
};

const registerSurveyor: IController = async (req, res) => {
    try {
        const keyStore: string = getKeyStore("org2");
        const newIdentityName = await bcUserService.generateNewUserIdentityName("org2");

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
            fabric_ca_client = new Fabric_CA_Client('http://ca.org2.hurley.lab:7054', null, '', crypto_suite);
            return fabric_client.getUserContext('admin', true);
        }).then(async (user_from_store) => {
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
                mspid: 'org2MSP',
                cryptoContent: {
                    privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate
                },
                skipPersistence: true
            });
        }).then((user) => {
            return fabric_client.setUserContext(user);
        }).then(async () => {
            const newUser = new User();
            newUser.email = req.body.surveyor.email;
            newUser.password = await generateHash(req.body.surveyor.email, 10);
            newUser.type = "surveyor";
            newUser.regId = req.body.surveyor.regId;
            newUser.firstName = req.body.surveyor.fname;
            newUser.lastName = req.body.surveyor.lname;
            newUser.nic = req.body.surveyor.nic;
            let savUser = await getRepository(User).save(newUser);

            await bcUserService.createBcUser(savUser, newIdentityName, "org2");

            logger.info(newIdentityName + ' was successfully registered and enrolled and is ready to interact with the fabric network');
            apiResponse.result(res, { message: newIdentityName + ' was successfully registered and enrolled' }, httpStatusCodes.CREATED);
        }).catch((err) => {
            if (err.toString().indexOf('Authorization') > -1) {
                let errmsg = 'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                    'Try again after deleting the contents of the store directory ' + security_config.keyStore;
                apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, errmsg);
            }
            apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, err);
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

const getUserByNic: IController = async (req, res) => {
    const user = await userService.getNicUserByNic(req.body.nic);
    if (user) {
        apiResponse.result(res, user, httpStatusCodes.OK);
    } else {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, locale.INVALID_CREDENTIALS);
    }
};


export default {
    register,
    loginBackend,
    loginBlockchain_identityName,
    loginBlockchain_identityOrg,
    loginBlockchain,
    registerNotary,
    registerSurveyor,
    getUserByNic,
    self,
};