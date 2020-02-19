import { join, resolve } from "path";
import { FabricControllerAdapter } from '@worldsibu/convector-adapter-fabric';
import { Land } from 'land-cc';
import * as fs from 'fs';
import { bc_config } from './config/blockchain';

// new test
export function createBCAdapter(identityName: string, keyStore: string, networkProfile: string) {
    return new FabricControllerAdapter({
        txTimeout: 300000,
        user: identityName,
        channel: bc_config.channel,
        chaincode: bc_config.chaincode,
        keyStore: resolve(__dirname, keyStore),
        networkProfile: resolve(__dirname, networkProfile)
    });
}

export const backends = {
    adapter: null,
    initAdapter: null,
    LandControllerBackEnd: null
}

// new test
export async function initServerIdentityForBC(landCtrlBackend: any) {
    const res = await landCtrlBackend.queryLand('0000000');
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

// new test
export async function checkCryptographicMaterialsForBC(keyStore: string, identityName: string) {
    const contextPath = join(keyStore + '/' + identityName);
    fs.readFile(contextPath, 'utf8', async function (err, data) {
        if (err) {
            throw new Error(`Context in ${contextPath} doesn't exist. Make sure that path resolves to your key stores folder`);
        } else {
            console.log('Context path with cryptographic materials exists');
        }
    });
}