import { getRepository } from 'typeorm';
import { generateHash, verifyHash } from '../utils/encrytionUtils';
import { sanitizeAuthUser } from '../utils/apiUtils';
import { AuthUser } from '../entities/user.auth.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { UserSurveyor } from '../entities/user.surveyor.entity';
import { NIC } from '../entities/nic.entity';
import { UserRLR } from '../entities/user.rlr.entity';
import { LandPlan } from '../entities/land.plan.entity';
import { UserBlockchain } from '../entities/user.blockchain.entity';

// ------------------------------ Auth User Entity --------------------------------
async function getAuthUserById(id: string): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).findOne({ id: id }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No user found");
            return new AuthUser(res.id, res.emailAddress, res.password, res.type, res.createdAt as Date, res.updatedAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function getAuthUserByEmail(email: string): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).findOne({ where: { emailAddress: email } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No user found");
            return new AuthUser(res.id, res.emailAddress, res.password, res.type, res.createdAt as Date, res.updatedAt as Date);
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
            return new AuthUser(res.id, res.emailAddress, res.password, res.type, res.createdAt as Date, res.updatedAt as Date);
        });
    } catch (e) {
        return e.message;
    }
}

async function updateAuthUser(user: AuthUser): Promise<AuthUser | string> {
    try {
        return await getRepository(AuthUser).save(user).then((res: any) => {
            return new AuthUser(res.id, res.emailAddress, res.password, res.type, res.createdAt as Date, res.updatedAt as Date);
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

async function getUserNotaryById(id: string): Promise<UserNotary | string> {
    try {
        let authUser: AuthUser | string = await getAuthUserById(id);
        if (authUser instanceof AuthUser) return await getRepository(UserNotary).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No notary user found");
            return new UserNotary(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo, res.postalAddress,
                res.registeredAt as Date, res.firstName, res.lastName, res.nic as NIC, res.registeredRLR as UserRLR);
        });
        else throw new Error("No Notary user information found");
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

async function getUserSurveyorById(id: string): Promise<UserSurveyor | string> {
    try {
        let authUser: AuthUser | string = await getAuthUserById(id);
        if (authUser instanceof AuthUser) return await getRepository(UserSurveyor).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No surveyor user found");
            return new UserSurveyor(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo, res.postalAddress,
                res.registeredAt as Date, res.firstName, res.lastName, res.nic as NIC, res.plans as LandPlan[]);
        });
        else throw new Error("No Surveyor user information found");
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

async function getUserRLRById(id: string): Promise<UserRLR | string> {
    try {
        let authUser: AuthUser | string = await getAuthUserById(id);
        if (authUser instanceof AuthUser) return await getRepository(UserRLR).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No rlr user found");
            return new UserRLR(res.user as AuthUser, res.registeredId, res.publicName, res.contactNo,
                res.postalAddress, res.registeredAt as Date, res.registeredNotaries as UserNotary[]);
        });
        else throw new Error("No RLR user information found");
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

// ------------------------------ Blockchain User Entity --------------------------------
async function getUserBlockchain(authUser: AuthUser): Promise<UserBlockchain | string> {
    try {
        return await getRepository(UserBlockchain).findOne({ where: { user: authUser } }).then((res: any) => {
            if (res == null || res == undefined) throw new Error("No blockchain user found");
            return new UserBlockchain(res.user as AuthUser, res.identityName, res.identityOrg);
        });
    } catch (e) {
        return e.message;
    }
}

async function createOrUpdateUserBlockchain(userBlockchain: UserBlockchain): Promise<UserBlockchain | string> {
    try {
        return await getRepository(UserBlockchain).save(userBlockchain).then((res: any) => {
            return new UserBlockchain(res.user as AuthUser, res.identityName, res.identityOrg);
        });
    } catch (e) {
        return e.message;
    }
}

async function deleteUserBlockchain(authUser: AuthUser): Promise<string> {
    try {
        return await getRepository(UserBlockchain).delete({ user: authUser }).then(async (res: any) => {
            if (res == null || res == undefined) throw new Error("No blockchain user found");
            return "Blockchain user : " + authUser.id + " successfully deleted";
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

// ------------------------------ Other Services --------------------------------
async function userLogin(email: string, password: string): Promise<AuthUser | string> {
    let authUser: AuthUser | string = await getAuthUserByEmail(email);
    if (authUser instanceof AuthUser) {
        if (await verifyHash(password, authUser.password)) {
            return sanitizeAuthUser(authUser);
        } else {
            return "User password is incorrect";
        }
    } else {
        return authUser;
    }
}

export default {
    getAuthUserById,
    getAuthUserByEmail,
    createAuthUser,
    updateAuthUser,
    updateAuthUserPassword,
    deleteAuthUserById,

    getUserNotary,
    getUserNotaryById,
    createOrUpdateUserNotary,
    deleteUserNotary,

    getUserSurveyor,
    getUserSurveyorById,
    createOrUpdateUserSurveyor,
    deleteUserSurveyor,

    getUserRLR,
    getUserRLRById,
    createOrUpdateUserRLR,
    deleteUserRLR,

    getUserBlockchain,
    createOrUpdateUserBlockchain,
    deleteUserBlockchain,

    getNicByNo,
    createOrUpdateNic,
    deleteNic,

    userLogin
};
