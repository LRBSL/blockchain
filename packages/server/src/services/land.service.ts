import { getRepository } from 'typeorm';
import { Land } from '../entities/land.entity';
import { LandDeed } from '../entities/land.deed.entity';
import { LandPlan } from '../entities/land.plan.entity';

// ------------------------------ Land Entity --------------------------------
async function getLandById(id: string): Promise<Land | string> {
    try {
        return await getRepository(Land).findOne({ where: { id: id } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No land information found");
            return new Land(res.id, res.ownerNic, res.secureKey, res.deed, res.plan);
        });
    } catch (e) {
        return e.message;
    }
}

async function getLandNicKey(nicNo: string, secureKey: string): Promise<Land | string> {
    try {
        return await getRepository(Land).findOne({ where: { ownerNic: nicNo, secureKey: secureKey }}).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No land information found");
            return new Land(res.id, res.ownerNic, res.secureKey, res.deed, res.plan);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateLand(land: Land): Promise<Land | string> {
    try {
        return await getRepository(Land).save(land).then((res: any) => {
            return new Land(res.id, res.ownerNic, res.secureKey, res.deed, res.plan);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteLand(id: string): Promise<string> {
    try {
        return await getRepository(Land).delete({ id: id }).then(async (res: any) => {
            if (res == null || res == undefined) throw new Error("No land information found");
            return "Land information on : " + id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

// ------------------------------ Deed Entity --------------------------------
async function getDeedById(id: string): Promise<LandDeed | string> {
    try {
        return await getRepository(LandDeed).findOne({ where: { id: id } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No deed information found");
            return new LandDeed(res.id, res.type, res.registeredNotary,
                res.registeredRLR, res.registeredAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateDeed(deed: LandDeed): Promise<LandDeed | string> {
    try {
        if (deed.id == null || deed.id == undefined) {
            let newDeed = new LandDeed();
            newDeed.registeredNotary = deed.registeredNotary;
            newDeed.registeredRLR = deed.registeredRLR;
            newDeed.type = deed.type;
            return await getRepository(LandDeed).save(newDeed).then((res: any) => {
                return new LandDeed(res.id, res.type, res.registeredNotary,
                    res.registeredRLR, res.registeredAt as Date);
            });
        }
        return await getRepository(LandDeed).save(deed).then((res: any) => {
            return new LandDeed(res.id, res.type, res.registeredNotary,
                res.registeredRLR, res.registeredAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteDeed(id: string): Promise<string> {
    try {
        return await getRepository(LandDeed).delete({ id: id }).then(async (res: any) => {
            if (res == null || res == undefined) throw new Error("No deed information found");
            return "Deed information on : " + id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

// ------------------------------ Plan Entity --------------------------------
async function getPlanById(id: string): Promise<LandPlan | string> {
    try {
        return await getRepository(LandPlan).findOne({ where: { id: id } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No plan information found");
            return new LandPlan(res.id, res.registeredSurveyor,
                res.registeredRLR, res.registeredAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdatePlan(plan: LandPlan): Promise<LandPlan | string> {
    try {
        if (plan.id == null || plan.id == undefined) {
            let newPlan = new LandPlan();
            newPlan.registeredSurveyor = plan.registeredSurveyor;
            newPlan.registeredRLR = plan.registeredRLR;
            return await getRepository(LandPlan).save(newPlan).then((res: any) => {
                return new LandPlan(res.id, res.registeredSurveyor,
                    res.registeredRLR, res.registeredAt as Date);
            });
        }
        return await getRepository(LandPlan).save(plan).then((res: any) => {
            return new LandPlan(res.id, res.registeredSurveyor,
                res.registeredRLR, res.registeredAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function deletePlan(id: string): Promise<string> {
    try {
        return await getRepository(LandPlan).delete({ id: id }).then(async (res: any) => {
            if (res == null || res == undefined) throw new Error("No plan information found");
            return "Plan information on : " + id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

export default {
    getLandById,
    getLandNicKey,
    createOrUpdateLand,
    deleteLand,

    getDeedById,
    createOrUpdateDeed,
    deleteDeed,

    getPlanById,
    createOrUpdatePlan,
    deletePlan
};