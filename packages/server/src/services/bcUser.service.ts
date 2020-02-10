import { getRepository } from 'typeorm';
import { BcUser } from '../entities/user/bcUser.entity';
import { User } from '../entities/user/user.entity';

const getBcUserById = async (userId: number) => {
    try {
        return await getRepository(BcUser).findOne(userId);
    } catch (e) {
        return null;
    }
};

const createBcUser = async (id: User, identityName: string, identityOrg: string) => {
    const newBcUser = new BcUser();
    newBcUser.id = id;
    newBcUser.identityName = identityName;
    newBcUser.identityOrg = identityOrg;
    return await getRepository(BcUser).save(newBcUser);
};

export default {
    createBcUser,
    getBcUserById
};