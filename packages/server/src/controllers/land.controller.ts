import IController from '../types/IController';
import landService from '../services/land.service';
import apiResponse from '../utils/apiResponse';
import * as httpStatusCodes from 'http-status-codes';
import { Land } from '../entities/land.entity';
import userService from '../services/user.service';
import { NIC } from '../entities/nic.entity';
import blockchainController from './blockchain.controller';
import { UserRLR } from '../entities/user.rlr.entity';
import { LandDeed } from '../entities/land.deed.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { LandPlan } from '../entities/land.plan.entity';
import { UserSurveyor } from '../entities/user.surveyor.entity';

const getLandIdFromLandMap: IController = async (req, res) => {
    const landMap = await landService.getLandBySecureKeyNIC(req.body.nic, req.body.key);
    if (landMap) {
        apiResponse.result(res, landMap.id, httpStatusCodes.OK);
    } else {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, "No resource found");
    }
};

const getDeedByLandId: IController = async (req, res) => {
    const deed = await landService.getDeedByLandId(req.body.landId);
    if (deed) {
        apiResponse.result(res, deed, httpStatusCodes.OK);
    } else {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, "No resource found");
    }
};

async function ownerVerification(req, res) {
    try {
        let landInfo: Land | string = await landService.getLandNicKey(req.body.nic, req.body.key);
        if (landInfo instanceof Land) {
            let land = await blockchainController.queryLand(req.body.userId, landInfo.id);
            let owner = await userService.getNicByNo(landInfo.ownerNic);
            let deed = (await landService.getDeedById(landInfo.deed)) as LandDeed;
            let plan = (await landService.getPlanById(landInfo.plan)) as LandPlan;

            let output = {
                land: {
                    id: landInfo.id,
                    rlregistry: ((await userService.getUserRLRById(land._rlregistry)) as UserRLR).registeredId,
                    current_owner_nic: land._current_owner_nic,
                    extent: land._extent,
                    boundaries: land._boundaries,
                    notary_vote: ((await userService.getUserNotaryById(land._notary_vote)) as UserNotary).registeredId,
                },
                owner: owner,
                deed: {
                    id: deed.id,
                    type: deed.type,
                    registeredNotary: ((await userService.getUserNotaryById(deed.registeredNotary)) as UserNotary).registeredId,
                    registeredAt: deed.registeredAt
                }, plan: {
                    id: plan.id,
                    registeredSurveyor: ((await userService.getUserSurveyorById(plan.registeredSurveyor)) as UserSurveyor).registeredId,
                    registeredAt: plan.registeredAt
                }
            }
            apiResponse.result(res, output, httpStatusCodes.OK);
            return;
        } else {
            apiResponse.error(res, httpStatusCodes.NOT_FOUND, landInfo);
            return;
        }
    } catch (e) {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, e.message);
    }
}

async function getHistoryForLand(req, res) {
    try {
        let history = await blockchainController.getHistoryForLand(req.body.userId, req.body.id);
        apiResponse.result(res, history, httpStatusCodes.OK);
    } catch (e) {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, e.message);
    }
}

async function buyerVerification(req, res) {
    try {
        let buyer = await userService.getNicByNo(req.body.nic);
        apiResponse.result(res, (buyer as NIC), httpStatusCodes.OK);
    } catch (e) {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, e.message);
    }
}

async function changeNotaryVote(req, res) {
    try {
        let output = await blockchainController.changeNotaryVote(req.body.userId, req.body.id, req.body.newNicNo);
        apiResponse.result(res, output, httpStatusCodes.OK);
    } catch (e) {
        apiResponse.error(res, httpStatusCodes.NOT_FOUND, e.message);
    }
}

export default {
    ownerVerification,
    getHistoryForLand,
    buyerVerification,
    changeNotaryVote,
    getLandIdFromLandMap,
    getDeedByLandId
};