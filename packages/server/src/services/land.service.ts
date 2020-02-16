import { getRepository } from 'typeorm';
import { Land } from '../entities/land.entity';
import { LandMap } from '../entities/land/landMap.entity';
import userService from './user.service';
import { Deed } from '../entities/land/deed.entity';
import { User } from '../entities/user/user.entity';
import { LandDeed } from '../entities/land.deed.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { UserRLR } from '../entities/user.rlr.entity';
import { NIC } from '../entities/nic.entity';
import { LandPlan } from '../entities/land.plan.entity';
import { UserSurveyor } from '../entities/user.surveyor.entity';

// ------------------------------ Land Entity --------------------------------
async function getLandById(id: string): Promise<Land | string> {
    try {
        return await getRepository(Land).findOne({ where: { id: id } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No land information found");
            return new Land(res.id, res.ownerNic as NIC, res.secureKey, res.deed as LandDeed, res.plan as LandPlan);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateLand(land: Land): Promise<Land | string> {
    try {
        return await getRepository(Land).save(land).then((res: any) => {
            return new Land(res.id, res.ownerNic as NIC, res.secureKey, res.deed as LandDeed, res.plan as LandPlan);
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
            return new LandDeed(res.id, res.type, res.registeredNotary as UserNotary,
                res.registeredRLR as UserRLR, res.registeredAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateDeed(deed: LandDeed): Promise<LandDeed | string> {
    try {
        if(deed.id == null || deed.id == undefined) {
            let newDeed = new LandDeed();
            newDeed.registeredNotary = deed.registeredNotary;
            newDeed.registeredRLR = deed.registeredRLR;
            newDeed.type = deed.type;
            return await getRepository(LandDeed).save(newDeed).then((res: any) => {
                return new LandDeed(res.id, res.type, res.registeredNotary as UserNotary,
                    res.registeredRLR as UserRLR, res.registeredAt as Date);
            });
        }
        return await getRepository(LandDeed).save(deed).then((res: any) => {
            return new LandDeed(res.id, res.type, res.registeredNotary as UserNotary,
                res.registeredRLR as UserRLR, res.registeredAt as Date);
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
            return new LandPlan(res.id, res.registeredSurveyor as UserSurveyor,
                res.registeredRLR as UserRLR, res.registeredAt as Date);
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
                return new LandPlan(res.id, res.registeredSurveyor as UserSurveyor,
                    res.registeredRLR as UserRLR, res.registeredAt as Date);
            });
        }
        return await getRepository(LandPlan).save(plan).then((res: any) => {
            return new LandPlan(res.id, res.registeredSurveyor as UserSurveyor,
                res.registeredRLR as UserRLR, res.registeredAt as Date);
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




// ------------------------------ ###################### --------------------------------
// const getLandById = async (landId: string) => {
//     try {
//         return (await getRepository(Land).findOne({ id: landId }));
//     } catch (e) {
//         return null;
//     }
// };

const getLandsCount = async () => {
    try {
        return (await getRepository(Land).find({})).length
    } catch (e) {
        return null;
    }
};

const createLand = async (id: string) => {
    const newLand = new Land();
    newLand.id = id;
    return (await getRepository(Land).save(newLand));
};

const updateLand = async (land: Land) => {
    return await getRepository(Land).save(land);
};

const createLandMap = async (id: string, nic: string, key: string) => {
    const newLandMap = new LandMap();
    // newLandMap.id = await getLandById(id);
    newLandMap.userNic = nic;
    newLandMap.secureKey = key;
    return (await getRepository(LandMap).save(newLandMap));
};

const getLandBySecureKeyNIC = async (nic: string, key: string) => {
    try {
        return (await getRepository(LandMap).findOne({ where: { userNic: nic, secureKey: key } }));
    } catch (e) {
        return null;
    }
};

// const getDeedById = async (deedId: number) => {
//     try {
//         return (await getRepository(Deed).findOne({ id: deedId }));
//     } catch (e) {
//         return null;
//     }
// };

const getDeedByLandId = async (landId: string) => {
    try {
        // return (await getRepository(Deed).findOne({ land: (await getLandById(landId)) }));
    } catch (e) {
        return null;
    }
};

const createDeed = async (id: number, land: Land, registeredNotary: User, type?: string, registeredDate?: Date) => {
    const newDeed = new Deed();
    newDeed.id = id;
    newDeed.land = land;
    newDeed.registeredNotary = registeredNotary;
    newDeed.type = type;
    newDeed.registeredDate = registeredDate;
    return (await getRepository(Deed).save(newDeed));
};

const updateDeed = async (deed: Deed) => {
    return await getRepository(Deed).save(deed);
};

export default {
    getLandById,
    createOrUpdateLand,
    deleteLand,

    getDeedById,
    createOrUpdateDeed,
    deleteDeed,

    getPlanById,
    createOrUpdatePlan,
    deletePlan,

    getLandsCount,
    createLand,
    createLandMap,
    getLandBySecureKeyNIC,

    getDeedByLandId,
    createDeed
};