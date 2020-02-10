import userService from "../services/user.service";
import bcUserService from '../services/bcUser.service';
import logger from '../config/logger';
import { getRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';

export async function seedData() {
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
    logger.info("initial data seeded");
}