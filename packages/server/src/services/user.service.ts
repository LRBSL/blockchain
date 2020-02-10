import { getRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { generateHash, verifyHash } from '../utils/encrytionUtils';
import { sanitizeUser } from '../utils/apiUtils';

const getUserById = async (userId: number) => {
    try {
        return await sanitizeUser(await getRepository(User).findOne({ id: userId }));
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

export default {
    createUser,
    createUserWithoutSanitize,
    loginUser,
    getUserById,
};
