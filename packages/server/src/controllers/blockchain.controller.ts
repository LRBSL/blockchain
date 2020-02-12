import { Request, Response } from 'express';
import { backends, createBCAdapter } from '../convector';
import IController from '../types/IController';
import apiResponse from '../utils/apiResponse';
import * as httpStatusCodes from 'http-status-codes';
import { extractBCCookiesFromRequest } from '../utils/apiUtils';
import { getKeyStore, getNetworkProfile } from '../utils/bcUtils';
import { LandController } from 'land-cc';
import { ClientFactory } from '@worldsibu/convector-core';
import logger from '../config/logger';

// export async function LandController_queryLand_get(req: Request, res: Response): Promise<void> {
//     try {
//         let params = req.params;
//         res.status(200).send(await backends.LandControllerBackEnd
//             .queryLand(params.id));
//     } catch (ex) {
//         console.log('Error get LandController_queryLand', ex.stack);
//         res.status(500).send('Error : ' + ex.message);
//     }
// }

// export async function LandController_queryAllLands_get(req: Request, res: Response): Promise<void> {
//     try {
//         res.status(200).send(await backends.LandControllerBackEnd
//             .queryAllLands());
//     } catch (ex) {
//         console.log('Error get LandController_queryAllLands', ex.stack);
//         res.status(500).send('Error : ' + ex.message);
//     }
// }

// export async function LandController_getHistoryForLand_get(req: Request, res: Response): Promise<void> {
//     try {
//         let params = req.params;
//         res.status(200).send(await backends.LandControllerBackEnd
//             .getHistoryForLand(params.id));
//     } catch (ex) {
//         console.log('Error get LandController_getHistoryForLand', ex.stack);
//         res.status(500).send('Error : ' + ex.message);
//     }
// }

export async function LandController_registerRLR_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .registerRLR(params.id, params.name));
    } catch (ex) {
        console.log('Error post LandController_registerRLR', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_registerNotary_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .registerNotary(params.id, params.fullname, params.reg_id, params.nic, params.registered_rlr_id));
    } catch (ex) {
        console.log('Error post LandController_registerNotary', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_registerSurveyor_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .registerSurveyor(params.id, params.fullname, params.reg_id, params.nic));
    } catch (ex) {
        console.log('Error post LandController_registerSurveyor', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_changeLandOwner_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .changeLandOwner(params.id));
    } catch (ex) {
        console.log('Error post LandController_changeLandOwner', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_voteSurveyor_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .voteSurveyor(params.id, params.surveyorId));
    } catch (ex) {
        console.log('Error post LandController_changeLandOwner', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_voteNotary_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .voteNotary(params.id, params.notaryId, params.newOwnerNIC));
    } catch (ex) {
        console.log('Error post LandController_voteNotary', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_voteCurrentOwner_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .voteCurrentOwner(params.id, params.ownerVote));
    } catch (ex) {
        console.log('Error post LandController_voteCurrentOwner', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_forkLand_post(req: Request, res: Response): Promise<void> {
    try {
        let params = req.body;
        res.status(200).send(await backends.LandControllerBackEnd
            .forkLand(params.id, params.land1, params.land2, params.surveyorId));
    } catch (ex) {
        console.log('Error post LandController_forkLand', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

const queryLand: IController = async (req, res) => {
    try {
        let land = (await bcBackendGenerator(req)).queryLand(req.body.id);
        logger.info(land);
        apiResponse.result(res, land, httpStatusCodes.OK);
    } catch (ex) {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, ex.message);
    }
};

const queryAllLands: IController = async (req, res) => {
    try {
        let lands = (await bcBackendGenerator(req)).queryAllLands();
        apiResponse.result(res, lands, httpStatusCodes.OK);
    } catch (ex) {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, ex.message);
    }
};

const getHistoryForLand: IController = async (req, res) => {
    try {
        let land = (await bcBackendGenerator(req)).getHistoryForLand(req.body.id);
        apiResponse.result(res, land, httpStatusCodes.OK);
    } catch (ex) {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, ex.message);
    }
};

const bcBackendGenerator = async (req) => {

    const data = extractBCCookiesFromRequest(req.headers.cookie);
    const identityName: string = data.identityName;
    const identityOrg: string = data.identityOrg;

    const keyStore: string = getKeyStore(identityOrg);
    const networkProfile: string = getNetworkProfile(identityOrg);

    const adapter = createBCAdapter(identityName, keyStore, networkProfile);
    await adapter.init();

    return ClientFactory(LandController, adapter);
}

export default {
    queryLand,
    queryAllLands,
    getHistoryForLand
};

