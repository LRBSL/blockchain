import userService from "../services/user.service";
import { getRepository, QueryRunner } from 'typeorm';
import landService from '../services/land.service';
import blockchainService from '../services/blockchain.service';
import { Land } from '../entities/land.entity';
import { AuthUser } from '../entities/user.auth.entity';
import { UserBlockchain } from '../entities/user.blockchain.entity';
import { UserNotary } from '../entities/user.notary.entity';
import { NIC } from '../entities/nic.entity';
import { LandDeed } from '../entities/land.deed.entity';
import { UserRLR } from '../entities/user.rlr.entity';
import * as LandBC from 'land-cc';
import { LandPlan } from '../entities/land.plan.entity';
import { UserSurveyor } from '../entities/user.surveyor.entity';

export async function seedData() {
    await deleteTablesOrder();

    // Nic objects
    let nicObj1 = new NIC("123456789V", "Pasindu Madusanka Senerath", "m", "32, Main Street, Kottawa", new Date(2005, 2, 13));
    let nicObj2 = new NIC("123456788V", "Sachintha Rathnayake", "m", "10/4, Suhada Rd, Seeduwa", new Date(2007, 10, 14));
    let nicObj3 = new NIC("123456787V", "Vishmanthi Fernando", "f", "55, Church Rd, Seeduwa", new Date(2012, 7, 3));
    let nicObj4 = new NIC("123456786V", "Anne Lasanthika", "f", "620/3, Main Street, Kandana", new Date(2010, 6, 13));
    let nicObj5 = new NIC("123456785V", "Asitha Indrajith", "m", "97, 2nd Street, Nugegoda", new Date(2002, 5, 1));
    let nicObj6 = new NIC("123456784V", "Theekshana Anuradha", "m", "630/7, Greens Rd, Negombo", new Date(2012, 10, 13));
    let nicObj7 = new NIC("962650678V", "Ravindu Sachintha", "m", "640/57, 2nd Kurana, Negombo", new Date(2011, 9, 13));
    let nicObj8 = new NIC("966666666V", "Sachintha Ayeshmantha", "m", "32, 1st Street, Ja-ela", new Date(2011, 9, 13));

    // Nic relations
    let nicUser1 = await userService.createOrUpdateNic(nicObj1);
    let nicUser2 = await userService.createOrUpdateNic(nicObj2);
    let nicUser3 = await userService.createOrUpdateNic(nicObj3);
    let nicUser4 = await userService.createOrUpdateNic(nicObj4);
    let nicUser5 = await userService.createOrUpdateNic(nicObj5);
    let nicUser6 = await userService.createOrUpdateNic(nicObj6);
    let nicUser7 = await userService.createOrUpdateNic(nicObj7);
    let nicUser8 = await userService.createOrUpdateNic(nicObj8);

    // Auth user relations
    let authUserAR = await userService.createAuthUser("colombo1.rlr.admin@gov.lk", "colombo1.rlr.admin@gov.lk", "r");
    let authUserUR = await userService.createAuthUser("colombo1.rlr.user@gov.lk", "colombo1.rlr.user@gov.lk", "r");
    let authUserAN = await userService.createAuthUser("colombo1.notary.admin@gov.lk", "colombo1.notary.admin@gov.lk", "n");
    let authUserUN = await userService.createAuthUser("colombo1.notary.user@gov.lk", "colombo1.notary.user@gov.lk", "n");
    let authUserAS = await userService.createAuthUser("colombo1.surveyor.admin@gov.lk", "colombo1.surveyor.admin@gov.lk", "s");
    let authUserUS = await userService.createAuthUser("colombo1.surveyor.user@gov.lk", "colombo1.surveyor.user@gov.lk", "s");

    // Blockchain user objects
    let bcObj1 = new UserBlockchain(authUserAR as AuthUser, "admin", "org1");
    let bcObj2 = new UserBlockchain(authUserUR as AuthUser, "user1", "org1");
    let bcObj3 = new UserBlockchain(authUserAN as AuthUser, "admin", "org3");
    let bcObj4 = new UserBlockchain(authUserUN as AuthUser, "user1", "org3");
    let bcObj5 = new UserBlockchain(authUserAS as AuthUser, "admin", "org2");
    let bcObj6 = new UserBlockchain(authUserUS as AuthUser, "user1", "org2");

    // Blockchain user relations
    let bcUser1 = await userService.createOrUpdateUserBlockchain(bcObj1 as UserBlockchain);
    let bcUser2 = await userService.createOrUpdateUserBlockchain(bcObj2 as UserBlockchain);
    let bcUser3 = await userService.createOrUpdateUserBlockchain(bcObj3 as UserBlockchain);
    let bcUser4 = await userService.createOrUpdateUserBlockchain(bcObj4 as UserBlockchain);
    let bcUser5 = await userService.createOrUpdateUserBlockchain(bcObj5 as UserBlockchain);
    let bcUser6 = await userService.createOrUpdateUserBlockchain(bcObj6 as UserBlockchain);

    // RLR user objects
    let rlrUserObj1 = new UserRLR(authUserAR as AuthUser, "RLR_0001", "Colombo 01", "011-1111111",
        "01, Main Street, Colombo 01", null);

    // RLR user relations
    let rlrUser1 = await userService.createOrUpdateUserRLR(rlrUserObj1);

    // Notary user objects
    let notaryUserObj1 = new UserNotary(authUserAN as AuthUser, "NOTARY_0001", "Ravindu", "011-1234567",
        "640/57, 2nd Kurana, Negombo", null, "Ravindu", "Sachintha", nicUser7 as NIC, rlrUser1 as UserRLR);

    // Notary user relations
    let notaryUser1 = await userService.createOrUpdateUserNotary(notaryUserObj1);

    // Surveyor user objects
    let surveyorUserObj1 = new UserSurveyor(authUserAS as AuthUser, "SURVEYOR_0001", "Sachintha", "012-1234567",
        "32, 1st Street, Ja-ela", null, "Sachintha", "Ayeshmantha", nicUser8 as NIC);

    // Surveyor user relations
    let surveyorUser1 = await userService.createOrUpdateUserSurveyor(surveyorUserObj1);

    // Deed objects
    let landDeedObj1 = new LandDeed(null, "gift", (notaryUser1 as UserNotary).user.id, (rlrUser1 as UserRLR).user.id);

    // Deed relations
    let landDeed1 = await landService.createOrUpdateDeed(landDeedObj1);

    // Plan objects
    let landPlanObj1 = new LandPlan(null, (surveyorUser1 as UserSurveyor).user.id,(rlrUser1 as UserRLR).user.id);

    // Plan relations
    let landPlan1 = await landService.createOrUpdatePlan(landPlanObj1);

    // Land objects
    let landObj1 = new Land("0000", (nicUser1 as NIC).no, 1234, (landDeed1 as LandDeed).id, (landPlan1 as LandPlan).id);

    // Land relations
    let land1 = await landService.createOrUpdateLand(landObj1);

    let landBC1: LandBC.Land = new LandBC.Land({
        id: (land1 as Land).id,
        parent_land_id: 'nil',
        extent: 10000,
        rlregistry: (rlrUser1 as UserRLR).user.id,
        current_owner_nic: (nicUser1 as NIC).no,
        requested_new_owner_nic: 'nil',
        boundaries: [[0, 0], [0, 100], [100, 100], [100, 0]],
        surveyor_vote: (surveyorUser1 as UserSurveyor).user.id,
        notary_vote: 'nil',
        current_owner_vote: 'nil'
    });
    let landBC2: LandBC.Land = new LandBC.Land({
        id: '0000001',
        parent_land_id: 'nil',
        extent: 10000,
        rlregistry: 'col_6',
        current_owner_nic: (nicUser2 as NIC).no,
        requested_new_owner_nic: 'nil',
        boundaries: [[0, 100], [0, 200], [100, 200], [100, 100]],
        surveyor_vote: 'S002',
        notary_vote: 'nil',
        current_owner_vote: 'nil'
    });
    let landBC3: LandBC.Land = new LandBC.Land({
        id: '0000002',
        parent_land_id: 'nil',
        extent: 20000,
        rlregistry: 'col_7',
        current_owner_nic: (nicUser3 as NIC).no,
        requested_new_owner_nic: 'nil',
        boundaries: [[0, 200], [0, 300], [100, 300], [100, 200]],
        surveyor_vote: 'S003',
        notary_vote: 'nil',
        current_owner_vote: 'nil'
    });
    let landBC4: LandBC.Land = new LandBC.Land({
        id: '0000003',
        parent_land_id: 'nil',
        extent: 10000,
        rlregistry: 'col_7',
        current_owner_nic: (nicUser4 as NIC).no,
        requested_new_owner_nic: 'nil',
        boundaries: [[100, 0], [100, 100], [200, 100], [200, 0]],
        surveyor_vote: 'S003',
        notary_vote: 'nil',
        current_owner_vote: 'nil'
    });
    let landBC5: LandBC.Land = new LandBC.Land({
        id: '0000004',
        parent_land_id: 'nil',
        extent: 10000,
        rlregistry: 'col_7',
        current_owner_nic: (nicUser5 as NIC).no,
        requested_new_owner_nic: 'nil',
        boundaries: [[100, 100], [100, 200], [200, 200], [200, 100]],
        surveyor_vote: 'S004',
        notary_vote: 'nil',
        current_owner_vote: 'nil'
    });
    let landBC6: LandBC.Land = new LandBC.Land({
        id: '0000005',
        parent_land_id: 'nil',
        extent: 30000,
        rlregistry: 'col_8',
        current_owner_nic: (nicUser6 as NIC).no,
        requested_new_owner_nic: 'nil',
        boundaries: [[200, 0], [200, 300], [300, 300], [300, 0]],
        surveyor_vote: 'S004',
        notary_vote: 'nil',
        current_owner_vote: 'nil'
    });

    let x = await blockchainService.initialLandsCreation(authUserAR as AuthUser, [landBC1, landBC2, landBC3, landBC4, landBC5, landBC6]);
    console.log("Blockchain : " + x);

    let rlrX = await userService.createOrUpdateUserRLR(new UserRLR(authUserAR as AuthUser, "RLR_colombo", "Colombo RLR", "011234543", "--"));

}

async function deleteTablesOrder() {
    await getRepository("LandDeed").delete({});
    await getRepository("LandPlan").delete({});
    await getRepository("Land").delete({});
    await getRepository("UserSurveyor").delete({});
    await getRepository("UserNotary").delete({});
    await getRepository("UserRLR").delete({});
    await getRepository("NIC").delete({});
    await getRepository("UserBlockchain").delete({});
    await getRepository("AuthUser").delete({});
}

export async function down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TABLE nic_user").then((res) => {
        console.log("@@@@@@@2" + res)
    }).catch((err) => { console.log(err) });

}