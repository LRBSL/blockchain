import { Request, Response } from 'express';
import { backends } from '../convector';

export async function LandController_queryLand_get(req: Request, res: Response): Promise<void> {
    try {
        let params = req.params;
        res.status(200).send(await backends.LandControllerBackEnd
            .queryLand(params.id));
    } catch (ex) {
        console.log('Error get LandController_queryLand', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_queryAllLands_get(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).send(await backends.LandControllerBackEnd
            .queryAllLands());
    } catch (ex) {
        console.log('Error get LandController_queryAllLands', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

export async function LandController_getHistoryForLand_get(req: Request, res: Response): Promise<void> {
    try {
        let params = req.params;
        res.status(200).send(await backends.LandControllerBackEnd
            .getHistoryForLand(params.id));
    } catch (ex) {
        console.log('Error get LandController_getHistoryForLand', ex.stack);
        res.status(500).send('Error : ' + ex.message);
    }
}

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