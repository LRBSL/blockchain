import userService from "../services/user.service";
import bcUserService from '../services/bcUser.service';
import logger from '../config/logger';
import { getRepository, QueryRunner } from 'typeorm';
import { User } from '../entities/user/user.entity';
import landService from '../services/land.service';
import { Land } from '../entities/land/land.entity';
import { NicUser } from '../entities/user/nicUser.entity';
import { LandMap } from '../entities/land/landMap.entity';
import { Deed } from '../entities/land/deed.entity';

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

    let land1 = await landService.createLand("0000000");
    let land2 = await landService.createLand("0000001");
    let land3 = await landService.createLand("0000002");
    let land4 = await landService.createLand("0000003");
    let land5 = await landService.createLand("0000004");
    let land6 = await landService.createLand("0000005");

    let nic1 = await userService.createNicUser("123456789V", "aruna jayanath", "abc road, colombo", "male", new Date(1996, 12, 22));
    let nic2 = await userService.createNicUser("123456788V", "pubudu jayanath", "def road, colombo", "male", new Date(1995, 12, 21));
    let nic3 = await userService.createNicUser("123456787V", "sanduni silva", "efg road, colombo", "female", new Date(1996, 3, 13));
    let nic4 = await userService.createNicUser("123456786V", "mahesh perera", "abc road, colombo", "male", new Date(1996, 12, 25));
    let nic5 = await userService.createNicUser("123456785V", "janani jayanath", "efg road, colombo", "female", new Date(1996, 1, 27));
    let nic6 = await userService.createNicUser("123456784V", "sajun silva", "abc road, colombo", "male", new Date(1996, 9, 4));

    let landMap1 = await landService.createLandMap(land1.id, nic1.nic_no, "1234");
    let landMap2 = await landService.createLandMap(land2.id, nic2.nic_no, "2345");
    let landMap3 = await landService.createLandMap(land3.id, nic3.nic_no, "3456");
    let landMap4 = await landService.createLandMap(land4.id, nic4.nic_no, "4567");
    let landMap5 = await landService.createLandMap(land5.id, nic5.nic_no, "5678");
    let landMap6 = await landService.createLandMap(land6.id, nic6.nic_no, "6789");

    logger.info("initial data 2 seeded");
}

export async function seedData() {

}

export async function down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TABLE nic_user").then((res) => {
        console.log("@@@@@@@2" + res)
    }).catch((err) => { console.log(err) });

}