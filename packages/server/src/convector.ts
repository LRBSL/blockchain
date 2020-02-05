import { join, resolve } from "path";
import { FabricControllerAdapter } from '@worldsibu/convector-adapter-fabric';
import { identity_config, basic_config, security_config } from './config';
import { Land } from 'land-cc';
import * as fs from 'fs';

export function createAdapter() {
    return new FabricControllerAdapter({
        txTimeout: 300000,
        user: identity_config.identityName,
        channel: basic_config.channel,
        chaincode: basic_config.chaincode,
        keyStore: resolve(__dirname, security_config.keyStore),
        networkProfile: resolve(__dirname, security_config.networkProfile)
    });
}

export const backends = {
    adapter: null,
    initAdapter: null,
    LandControllerBackEnd: null
}

export async function initServerIdentity() {
    await backends.initAdapter;
    const res = await backends.LandControllerBackEnd.queryLand('0000000');
    try {
        const serverIdentity = new Land(res).toJSON();

        if (!serverIdentity || !serverIdentity.id) {
            throw new Error('Server identity does not exists, make sure to enroll it or seed data');
        } else {
            console.log('Server identity exists');
        }
    } catch (ex) {
        console.log(JSON.stringify(ex));
        throw new Error('Server identity does not exists, make sure to enroll it or seed data');
    }
}

export async function checkCryptographicMaterials() {
    const contextPath = join(security_config.keyStore + '/' + identity_config.identityName);
    fs.readFile(contextPath, 'utf8', async function (err, data) {
        if (err) {
            throw new Error(`Context in ${contextPath} doesn't exist. Make sure that path resolves to your key stores folder`);
        } else {
            console.log('Context path with cryptographic materials exists');
        }
    });
}