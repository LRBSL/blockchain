import { getRepository } from 'typeorm';
import { BcUser } from '../entities/user/bcUser.entity';
import { User } from '../entities/user/user.entity';
import logger from '../config/logger';

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

const generateNewUserIdentityName = async (identityOrg: string) => {
    try {
        let user = await getRepository(BcUser).find({
            where: { identityOrg: identityOrg },
            order: {
                identityName: "DESC"
            },
            take: 1
        });
        let userIdentityName: string = user[0].identityName;
        return "user" + (parseInt(userIdentityName.substr(4)) + 1);
    } catch (e) {
        return null;
    }
}

export default {
    createBcUser,
    getBcUserById,
    generateNewUserIdentityName
};