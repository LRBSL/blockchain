import { getRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { NicUser } from '../entities/user/nicUser.entity';
import { generateHash, verifyHash } from '../utils/encrytionUtils';
import { sanitizeUser } from '../utils/apiUtils';
import { AuthUser } from '../entities/user.auth.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { UserSurveyor } from '../entities/user.surveyor.entity';
import { NIC } from '../entities/nic.entity';
import { UserRLR } from '../entities/user.rlr.entity';
import { LandPlan } from '../entities/land.plan.entity';

// ------------------------------ Auth User Entity --------------------------------
async function getAuthUserById(id: string): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).findOne({ id: id }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No user found");
            return new AuthUser(res.id, res.emailAddress, null, res.type, res.createdAt as Date, res.updatedAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function getAuthUserByCredentials(email: string, password: string): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).findOne({ where: { emailAddress: email, password: password } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No user found");
            return new AuthUser(res.id, res.emailAddress, null, res.type, res.createdAt as Date, res.updatedAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function createAuthUser(email: string, password: string, type: string): Promise<AuthUser | string> {
    try {
        const newUser = new AuthUser();
        newUser.emailAddress = email;
        newUser.password = await generateHash(password, 10);
        newUser.type = type;
        return await getRepository(AuthUser).save(newUser).then((res: any) => {
            return new AuthUser(res.id, res.emailAddress, null, res.type, res.createdAt as Date, res.updatedAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function updateAuthUser(user: AuthUser): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).save(user).then((res: any) => {
            return new AuthUser(res.id, res.emailAddress, null, res.type, res.createdAt as Date, res.updatedAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function updateAuthUserPassword(id: string, password: string): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).findOne({ id: id }).then(async (res: any) => {
            if (res == null || res == undefined) throw new Error("No user found");
            let user = new AuthUser(res.id, res.emailAddress, password, res.type, res.createdAt as Date, res.updatedAt as Date);
            return await getRepository(AuthUser).save(user).then((res: any) => {
                return new AuthUser(res.id, res.emailAddress, null, res.type);
            });
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteAuthUserById(id: string): Promise<string> {
    try {
        return await getRepository(AuthUser).delete({ id: id }).then(async (res: any) => {
            if (res.affected == 0) throw new Error("No user found");
            return "User : " + id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

// ------------------------------ Notary User Entity --------------------------------
async function getUserNotary(authUser: AuthUser): Promise<UserNotary | string> {
    try {
        return await getRepository(UserNotary).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No notary user found");
            return new UserNotary(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo, res.postalAddress,
                res.registeredAt as Date, res.firstName, res.lastName, res.nic as NIC, res.registeredRLR as UserRLR);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateUserNotary(userNotary: UserNotary): Promise<UserNotary | string> {
    try {
        return await getRepository(UserNotary).save(userNotary).then((res: any) => {
            return new UserNotary(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo, res.postalAddress,
                res.registeredAt as Date, res.firstName, res.lastName, res.nic as NIC, res.registeredRLR as UserRLR);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteUserNotary(authUser: AuthUser): Promise<string> {
    try {
        return await getRepository(UserNotary).delete({ user: authUser }).then(async (res: any) => {
            if (res.affected == 0) throw new Error("No notary user found");
            return "Notary user : " + authUser.id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

// ------------------------------ Surveyor User Entity --------------------------------
async function getUserSurveyor(authUser: AuthUser): Promise<UserSurveyor | string> {
    try {
        return await getRepository(UserSurveyor).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No surveyor user found");
            return new UserSurveyor(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo, res.postalAddress,
                res.registeredAt as Date, res.firstName, res.lastName, res.nic as NIC, res.plans as LandPlan[]);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateUserSurveyor(userSurveyor: UserSurveyor): Promise<UserSurveyor | string> {
    try {
        return await getRepository(UserSurveyor).save(userSurveyor).then((res: any) => {
            return new UserSurveyor(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo, res.postalAddress,
                res.registeredAt as Date, res.firstName, res.lastName, res.nic as NIC, res.plans as LandPlan[]);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteUserSurveyor(authUser: AuthUser): Promise<string> {
    try {
        return await getRepository(UserSurveyor).delete({ user: authUser }).then(async (res: any) => {
            if (res.affected == 0) throw new Error("No surveyor user found");
            return "Surveyor user : " + authUser.id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

// ------------------------------ RLR User Entity --------------------------------
async function getUserRLR(authUser: AuthUser): Promise<UserRLR | string> {
    try {
        return await getRepository(UserRLR).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No rlr user found");
            return new UserRLR(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo,
                res.postalAddress, res.registeredAt as Date, res.registeredNotaries as UserNotary[]);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateUserRLR(userRLR: UserRLR): Promise<UserRLR | string> {
    try {
        return await getRepository(UserRLR).save(userRLR).then((res: any) => {
            return new UserRLR(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo,
                res.postalAddress, res.registeredAt as Date, res.registeredNotaries as UserNotary[]);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteUserRLR(authUser: AuthUser): Promise<string> {
    try {
        return await getRepository(UserRLR).delete({ user: authUser }).then(async (res: any) => {
            if (res == null || res == undefined) throw new Error("No rlr user found");
            return "RLR user : " + authUser.id + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}

// ------------------------------ NIC Entity --------------------------------
async function getNicByNo(nicNo: string): Promise<NIC | string> {
    try {
        return await getRepository(NIC).findOne({ where: { no: nicNo } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No NIC information found");
            return new NIC(res.no, res.name, res.gender, res.postalAddress, res.registeredDate as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateNic(nic: NIC): Promise<NIC | string> {
    try {
        return await getRepository(NIC).save(nic).then((res: any) => {
            return new NIC(res.no, res.name, res.gender, res.postalAddress, res.registeredDate as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteNic(nicNo: string): Promise<string> {
    try {
        return await getRepository(NIC).delete({ no: nicNo }).then(async (res: any) => {
            if (res.affected == 0) throw new Error("No NIC information found");
            return "NIC information on : " + nicNo + " successfully deleted";
        });
    } catch (e) {
        return e.message;
    }
}


// ------------------------------ ###################### --------------------------------
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
    getAuthUserById,
    getAuthUserByCredentials,
    createAuthUser,
    updateAuthUser,
    updateAuthUserPassword,
    deleteAuthUserById,

    getUserNotary,
    createOrUpdateUserNotary,
    deleteUserNotary,

    getUserSurveyor,
    createOrUpdateUserSurveyor,
    deleteUserSurveyor,

    getUserRLR,
    createOrUpdateUserRLR,
    deleteUserRLR,

    getNicByNo,
    createOrUpdateNic,
    deleteNic,

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
