import { getRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { NicUser } from '../entities/user/nicUser.entity';
import { generateHash, verifyHash } from '../utils/encrytionUtils';
import { sanitizeUser } from '../utils/apiUtils';

const getUserById = async (userId: number) => {
    try {
        return await sanitizeUser(await getRepository(User).findOne({ id: userId }));
    } catch (e) {
        return null;
    }
};

const getUserByNic = async (userNic: string) => {
    try {
        return await getRepository(User).findOne({ nic: userNic });
    } catch (e) {
        return null;
    }
};

const getUsersCount = async () => {
    try {
        return (await getRepository(User).find({})).length
    } catch (e) {
        return null;
    }
};

const getUserByEmail = async (email: string, getHash: boolean = false) => {
    try {
        return await getRepository(User).findOne({ email });
    } catch (e) {
        return null;
    }
};

const createUser = async (email: string, pass: string, type: string, regId: string) => {
    const newUser = new User();
    newUser.email = email;
    newUser.password = await generateHash(pass, 10);
    newUser.type = type;
    newUser.regId = regId;
    return sanitizeUser(await getRepository(User).save(newUser));
};

const createUserWithoutSanitize = async (email: string, pass: string, type: string, regId: string) => {
    const newUser = new User();
    newUser.email = email;
    newUser.password = await generateHash(pass, 10);
    newUser.type = type;
    newUser.regId = regId;
    return await getRepository(User).save(newUser);
};

const updateUser = async (user: User) => {
    return await getRepository(User).save(user);
};

const loginUser = async (email: string, password: string) => {
    const user = await getUserByEmail(email, true);
    if (user) {
        if (await verifyHash(password, user.password)) {
            user.lastLogin = new Date().getTime().toString();
            updateUser(user); // save user login time
            return sanitizeUser(user);
        }
    }
    return null;
};

// ----------------- NIC ---------------
const getNicUserByNic = async (nic: string) => {
    try {
        return await getRepository(NicUser).findOne({ nic_no: nic });
    } catch (e) {
        return null;
    }
};

const createNicUser = async (nic_no: string, name: string, address: string, sex: string, regDate: Date) => {
    const newNicUser = new NicUser();
    newNicUser.nic_no = nic_no;
    newNicUser.name = name;
    newNicUser.address = address;
    newNicUser.sex = sex;
    newNicUser.regDate = regDate;
    return await getRepository(NicUser).save(newNicUser);
};

export default {
    getUsersCount,
    createUser,
    createUserWithoutSanitize,
    loginUser,
    getUserById,
    updateUser,
    getUserByNic,
    getNicUserByNic,
    createNicUser
};
