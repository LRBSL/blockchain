import { AuthUser } from "../entities/user.auth.entity";
import { UserBlockchain } from '../entities/user.blockchain.entity';
import userService from './user.service';
import { getKeyStore, getNetworkProfile } from '../utils/bcUtils';
import { ClientFactory } from '@worldsibu/convector-core';
import { createBCAdapter } from '../convector';
import { LandController, Land } from 'land-cc';

async function initialLandsCreation(authUser: AuthUser, mockData: Land[]) {
    try {
        let landBackend = await BlockchainBackendGenerator(authUser);
        return await landBackend.createLands(mockData);
    } catch (ex) {
        return ex.message;
    }
}

async function BlockchainBackendGenerator(authUser: AuthUser) {
    let userBlochain: UserBlockchain | string = await userService.getUserBlockchain(authUser);
    if (userBlochain instanceof UserBlockchain) {
        let identityName = userBlochain.identityName;
        let identityOrg = userBlochain.identityOrg;
        let keyStore: string = getKeyStore(identityOrg);
        let networkProfile: string = getNetworkProfile(identityOrg);

        const adapter = createBCAdapter(identityName, keyStore, networkProfile);
        await adapter.init();
        return ClientFactory(LandController, adapter);
    }
    return null;
}

export default {
    BlockchainBackendGenerator,
    initialLandsCreation
}