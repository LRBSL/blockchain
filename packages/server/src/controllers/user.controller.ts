import { Request, Response } from 'express';
import { identity_config, updateSecurityConfig, security_config, ca_ports } from '../config';
import { backends, createAdapter, initServerIdentity, checkCryptographicMaterials } from '../convector';
import { ClientFactory } from '@worldsibu/convector-core';
import * as Fabric_Client from 'fabric-client';
import * as Fabric_CA_Client from 'fabric-ca-client';
import { LandController } from 'land-cc';
import { getAuthUser } from './database.controller';
import { checkBodyParams } from './utils';

const fabric_client = new Fabric_Client();
let fabric_ca_client = null;
let admin_user = null;
let member_user = null;

const homedir = require('os').homedir();

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
        })

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
                    res.send(JSON.stringify(curUser.username + " successfully logged"));
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
// @body userId, identityName
export async function LandController_register_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        checkBodyParams([params.userId, params.identityName]);
        // if(!checkBodyParams([params.userId])) {
        //     throw new Error('Mandotary requst parameters not found. Check request body again.');
        // }
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
                enrollmentID: params.userId,
                attrs: [{
                    name: params.userId,
                    value: 'true',
                    ecert: true
                }],
                role: 'client'
            }, admin_user);
        }).then((secret) => {
            // next we need to enroll the user with CA server
            console.log('Successfully registered '+ params.userId +' - secret:' + secret);
            return fabric_ca_client.enroll({
                enrollmentID: params.userId,
                enrollmentSecret: secret
            });
        }).then((enrollment) => {
            console.log('Successfully enrolled member user ' + params.userId);
            return fabric_client.createUser({
                username: params.identityName,
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
            console.log( params.userId + ' was successfully registered and enrolled and is ready to interact with the fabric network');
            res.send(JSON.stringify(params.userId + ' was successfully registered and enrolled'));
        }).catch((err) => {
            console.error('Failed to register: ' + err);
            if (err.toString().indexOf('Authorization') > -1) {
                console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                    'Try again after deleting the contents of the store directory ' + security_config.keyStore);
            }
        });
    } catch (ex) {
        console.log('Error post PersonController_register', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}