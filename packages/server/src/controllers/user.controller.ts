import { createBCAdapter, initServerIdentityForBC, checkCryptographicMaterialsForBC } from '../convector';
import { ClientFactory } from '@worldsibu/convector-core';
import * as Fabric_Client from 'fabric-client';
import * as Fabric_CA_Client from 'fabric-ca-client';
import { LandController } from 'land-cc';
import * as httpStatusCodes from 'http-status-codes';
import IController from '../types/IController';
import userService from '../services/user.service';
import { generateCookie } from '../utils/encrytionUtils';
import constants from '../constants';
import apiResponse from '../utils/apiResponse';
import locale from '../constants/locale';
import logger from '../config/logger';
import { getKeyStore, getNetworkProfile } from '../utils/bcUtils';
import { UserRLR } from '../entities/user.rlr.entity';
import { AuthUser } from '../entities/user.auth.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { NIC } from '../entities/nic.entity';
import { UserBlockchain } from '../entities/user.blockchain.entity';
import { UserSurveyor } from '../entities/user.surveyor.entity';

const fabric_client = new Fabric_Client();
let fabric_ca_client = null;

// Authentication related functions
async function registerRLR(req: any, res: any) {
    let authUser: AuthUser | string;
    let userRLR: UserRLR | string;
    try {
        authUser = await userService.createAuthUser(req.body.email, req.body.password, 'r');
        if (authUser instanceof AuthUser) {
            userRLR = await userService.createOrUpdateUserRLR(new UserRLR(authUser, req.body.registeredID,
                req.body.publicName, req.body.contactNo, req.body.postalAddress));
        } else {
            throw new Error(authUser);
        }
    } catch (e) {
        apiResponse.error(res, httpStatusCodes.BAD_GATEWAY, e.message);
        return;
    }
    if (userRLR instanceof UserRLR) {
        try {
            const keyStore: string = getKeyStore("org1");
            // const newIdentityName = await bcUserService.generateNewUserIdentityName("org3");
            const newIdentityName = "user2";

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
                fabric_ca_client = new Fabric_CA_Client('http://ca.org1.hurley.lab:7054', null, '', crypto_suite);
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
                console.log(newIdentityName)
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
                    mspid: 'org1MSP',
                    cryptoContent: {
                        privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate
                    },
                    skipPersistence: true
                });
            }).then((user) => {
                return fabric_client.setUserContext(user);
            }).then(async () => {
                await userService.createOrUpdateUserBlockchain(new UserBlockchain(authUser as AuthUser, newIdentityName, "org1"));
                logger.info(newIdentityName + ' was successfully registered and enrolled and is ready to interact with the fabric network');
                apiResponse.result(res, userRLR as UserRLR, httpStatusCodes.CREATED);
            }).catch((err) => {
                if (err.toString().indexOf('Authorization') > -1) {
                    let errmsg = 'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                        'Try again after deleting the contents of the store directory ' + keyStore;
                    apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, errmsg);
                    return;
                }
                apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, err);
                return;
            });
        } catch (ex) {
            apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
            return;
        }
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, "RLR user not created");
    }
};

async function registerNotary(req: any, res: any) {
    let authUser: AuthUser | string;
    let userNotary: UserNotary | string;
    try {
        authUser = await userService.createAuthUser(req.body.email, req.body.password, 'n');
        if (authUser instanceof AuthUser) {
            let nicUser: NIC | string = await userService.getNicByNo(req.body.nic);
            let registeredRLR: UserRLR | string = await userService.getUserRLRById(req.body.registeredRLR);
            if (!(nicUser instanceof NIC)) throw new Error(nicUser);
            if (!(registeredRLR instanceof UserRLR)) throw new Error(registeredRLR);
            userNotary = await userService.createOrUpdateUserNotary(new UserNotary(authUser, req.body.registeredID, req.body.publicName,
                req.body.contactNo, req.body.postalAddress, null, req.body.firstName, req.body.lastName, nicUser, registeredRLR));
        } else {
            throw new Error(authUser);
        }
    } catch (e) {
        if (authUser instanceof AuthUser) await userService.deleteAuthUserById(authUser.id);
        apiResponse.error(res, httpStatusCodes.BAD_GATEWAY, e.message);
        return;
    }
    if (userNotary instanceof UserNotary) {
        try {
            const keyStore: string = getKeyStore("org3");
            // const newIdentityName = await bcUserService.generateNewUserIdentityName("org3");
            const newIdentityName = "user9";

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
                console.log(newIdentityName)
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
                await userService.createOrUpdateUserBlockchain(new UserBlockchain(authUser as AuthUser, newIdentityName, "org3"));
                logger.info(newIdentityName + ' was successfully registered and enrolled and is ready to interact with the fabric network');
                apiResponse.result(res, userNotary as UserNotary, httpStatusCodes.CREATED);
            }).catch((err) => {
                if (err.toString().indexOf('Authorization') > -1) {
                    let errmsg = 'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                        'Try again after deleting the contents of the store directory ' + keyStore;
                    apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, errmsg);
                    return;
                }
                apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, err);
                return;
            });
        } catch (ex) {
            apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
            return;
        }
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, "Notary user not created");
    }
};

async function registerSurveyor(req: any, res: any) {
    let authUser: AuthUser | string;
    let userSurveyor: UserSurveyor | string;
    try {
        authUser = await userService.createAuthUser(req.body.email, req.body.password, 's');
        if (authUser instanceof AuthUser) {
            let nicUser: NIC | string = await userService.getNicByNo(req.body.nic);
            if (!(nicUser instanceof NIC)) throw new Error(nicUser);
            userSurveyor = await userService.createOrUpdateUserSurveyor(new UserSurveyor(authUser, req.body.registeredID, req.body.publicName,
                req.body.contactNo, req.body.postalAddress, null, req.body.firstName, req.body.lastName, nicUser));
        } else {
            throw new Error(authUser);
        }
    } catch (e) {
        if (authUser instanceof AuthUser) await userService.deleteAuthUserById(authUser.id);
        apiResponse.error(res, httpStatusCodes.BAD_GATEWAY, e.message);
        return;
    }
    if (userSurveyor instanceof UserSurveyor) {
        try {
            const keyStore: string = getKeyStore("org2");
            // const newIdentityName = await bcUserService.generateNewUserIdentityName("org3");
            const newIdentityName = "user2";

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
                console.log(newIdentityName)
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
                await userService.createOrUpdateUserBlockchain(new UserBlockchain(authUser as AuthUser, newIdentityName, "org2"));
                logger.info(newIdentityName + ' was successfully registered and enrolled and is ready to interact with the fabric network');
                apiResponse.result(res, userSurveyor as UserSurveyor, httpStatusCodes.CREATED);
            }).catch((err) => {
                if (err.toString().indexOf('Authorization') > -1) {
                    let errmsg = 'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                        'Try again after deleting the contents of the store directory ' + keyStore;
                    apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, errmsg);
                    return;
                }
                apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, err);
                return;
            });
        } catch (ex) {
            apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
            return;
        }
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, "Surveyor user not created");
    }
};

async function login(req: any, res: any) {
    let authUser: AuthUser | string = await userService.userLogin(req.body.email, req.body.password);
    if (authUser instanceof AuthUser) {
        try {
            let userBlochain: UserBlockchain | string = await userService.getUserBlockchain(authUser);
            if (userBlochain instanceof UserBlockchain) {
                let identityName = userBlochain.identityName;
                let identityOrg = userBlochain.identityOrg;
                let keyStore: string = getKeyStore(identityOrg);
                let networkProfile: string = getNetworkProfile(identityOrg);

                const adapter = createBCAdapter(identityName, keyStore, networkProfile);
                await adapter.init();
                const landCtrlBackend = ClientFactory(LandController, adapter);

                // optional
                initServerIdentityForBC(landCtrlBackend).then(() => {
                    checkCryptographicMaterialsForBC(keyStore, identityName).then(async () => {
                        const cookie = await generateUserCookie((authUser as AuthUser).id);
                        apiResponse.result(res, authUser as AuthUser, httpStatusCodes.OK, cookie);
                    });
                });
            } else {
                apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, userBlochain);
                return;
            }
        } catch (ex) {
            console.log("Error : " + ex.message)
            apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, ex);
        }
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, authUser);
    }
}

// Getting user information related functions
async function getRLRUserInfo(req: any, res: any) {
    let user: UserRLR | string = await userService.getUserRLRById(req.body.id);
    if (user instanceof UserRLR) {
        apiResponse.result(res, user, httpStatusCodes.OK);
    } else {
        apiResponse.error(res, httpStatusCodes.INTERNAL_SERVER_ERROR, user);
    }
}


const generateUserCookie = async (userId: string) => {
    return {
        key: constants.Cookie.COOKIE_USER,
        value: await generateCookie(constants.Cookie.KEY_USER_ID, userId),
    };
};


export default {
    registerRLR,
    registerNotary,
    registerSurveyor,
    login,
    getRLRUserInfo
};