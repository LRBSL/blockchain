import IController from '../types/IController';
import landService from '../services/land.service';
import apiResponse from '../utils/apiResponse';
import * as httpStatusCodes from 'http-status-codes';

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

export default {
    getLandIdFromLandMap,
    getDeedByLandId
};