import { getRepository } from 'typeorm';
import { Land } from '../entities/land/land.entity';
import { LandMap } from '../entities/land/landMap.entity';
import userService from './user.service';
import { Deed } from '../entities/land/deed.entity';
import { User } from '../entities/user/user.entity';

const getLandById = async (landId: string) => {
    try {
        return (await getRepository(Land).findOne({ id: landId }));
    } catch (e) {
        return null;
    }
};

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
    newLandMap.id = await getLandById(id);
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

const getDeedById = async (deedId: number) => {
    try {
        return (await getRepository(Deed).findOne({ id: deedId }));
    } catch (e) {
        return null;
    }
};

const getDeedByLandId = async (landId: string) => {
    try {
        return (await getRepository(Deed).findOne({ land: (await getLandById(landId)) }));
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
    getLandsCount,
    createLand,
    createLandMap,
    getLandBySecureKeyNIC,
    getDeedById,
    getDeedByLandId,
    createDeed
};