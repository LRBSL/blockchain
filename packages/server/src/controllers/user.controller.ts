import { Request, Response } from 'express';
import { identity_config, updateSecurityConfig } from '../config';
import { backends, createAdapter, initServerIdentity, checkCryptographicMaterials } from '../convector';
import { ClientFactory } from '@worldsibu/convector-core';
import { LandController } from 'land-cc';
import { getAuthUser } from './database.controller';

// user login function
// @body username, passwd
export async function LandController_login_post(req: Request, res: Response) {
    let curUser = null;
    
    await getAuthUser(req.body.username, req.body.passwd).then((result) => {
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
}