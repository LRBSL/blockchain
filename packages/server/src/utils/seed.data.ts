import userService from "../services/user.service";
import bcUserService from '../services/bcUser.service';
import logger from '../config/logger';
import { getRepository, QueryRunner } from 'typeorm';
import { User } from '../entities/user/user.entity';
import landService from '../services/land.service';
import { Land } from '../entities/land.entity';
import { NicUser } from '../entities/user/nicUser.entity';
import { LandMap } from '../entities/land/landMap.entity';
import { Deed } from '../entities/land/deed.entity';
import { AuthUser } from '../entities/user.auth.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { NIC } from '../entities/nic.entity';
import { LandDeed } from '../entities/land.deed.entity';

export async function seedData1() {
    // await getRepository(BcUser).delete({});
    await getRepository(User).delete({});

    let aduser1 = await userService.createUserWithoutSanitize("admin.rlr@gov.lk", "admin.rlr", "rlr", "RLR_ADMIN");
    bcUserService.createBcUser(aduser1, "admin", "org1");
    let aduser2 = await userService.createUserWithoutSanitize("admin.surveyor@gov.lk", "admin.surveyor", "surveyor", "SURVEYOR_ADMIN");
    bcUserService.createBcUser(aduser2, "admin", "org2");
    let aduser3 = await userService.createUserWithoutSanitize("admin.notary@gov.lk", "admin.notary", "notary", "NOTARY_ADMIN");
    bcUserService.createBcUser(aduser3, "admin", "org3");
    let user1 = await userService.createUserWithoutSanitize("colombo1.rlr@gov.lk", "colombo1.rlr", "rlr", "RLR_COLOMBO_01");
    bcUserService.createBcUser(user1, "user1", "org1");
    let user2 = await userService.createUserWithoutSanitize("thissa.surveyor@gov.lk", "thissa.surveyor", "surveyor", "SURVEYOR_THISSA");
    bcUserService.createBcUser(user2, "user1", "org2");
    let user3 = await userService.createUserWithoutSanitize("janaka.notary@gov.lk", "janaka.notary", "notary", "NOTARY_JANAKA");
    bcUserService.createBcUser(user3, "user1", "org3");
    logger.info("initial data 1 seeded");
}


export async function seedData2() {
    await getRepository(Land).delete({});
    await getRepository(NicUser).delete({});
    await getRepository(LandMap).delete({});
    await getRepository(Deed).delete({});




    logger.info("initial data 2 seeded");
}

export async function seedData() {
    await getRepository("Land").delete({});
    await getRepository("LandDeed").delete({});
    await getRepository("UserRLR").delete({});
    await getRepository("UserSurveyor").delete({});
    await getRepository("UserNotary").delete({});
    await getRepository("NIC").delete({});
    await getRepository("AuthUser").delete({});

    let au1: AuthUser | string = await userService.createAuthUser("abc@gmail.com", "abc@gmail.com", "n");
    let nic1: NIC | string = await userService.createOrUpdateNic(new NIC("962650678V", "Ravindu Sachintha", "m", "640/57, 2nd Kurana, Negombo", new Date(2012, 10, 13)));
    let tmpN: UserNotary | string = await userService.createOrUpdateUserNotary(new UserNotary(au1 as AuthUser, "NOT001", "Sachintha", 
    "077-2769963", "640/57, 2nd Kurana, Colombo Road, Negombo", null, "Ravindu", "Sachintha", nic1 as NIC, null));
    let land1: Land | string = await landService.createOrUpdateLand(new Land("0000001", nic1 as NIC, 1234, null, null))
    let deed1: LandDeed | string = await landService.createOrUpdateDeed(new LandDeed("11111111", "gift", tmpN as UserNotary, null, null))
    let lu1: Land = land1 as Land;
    lu1.deed = deed1 as LandDeed;
    let land1up: Land | string = await landService.createOrUpdateLand(lu1);
    console.log(land1up)

}

export async function down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TABLE nic_user").then((res) => {
        console.log("@@@@@@@2" + res)
    }).catch((err) => { console.log(err) });

}