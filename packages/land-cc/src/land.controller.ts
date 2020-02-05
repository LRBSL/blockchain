import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param,
  History
} from '@worldsibu/convector-core';

import { Land } from './land.model';
import { RLR } from './rlr.model';
import { Notary } from './notary.model';

@Controller('land')
export class LandController extends ConvectorController<ChaincodeTx> {
  
  // Initialize mock data
  @Invokable()
  public async init() {
    let land1: Land = new Land({
      id: '0000000',
      parent_land_id: 'nil',
      extent: 10000,
      rlregistry: 'col_6',
      current_owner_nic: '123456789V',
      requested_new_owner_nic: 'nil',
      boundaries: [[0,0],[0,100],[100,100],[100,0]],
      surveyor_vote: 'S001',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });
    let land2: Land = new Land({
      id: '0000001',
      parent_land_id: 'nil',
      extent: 10000,
      rlregistry: 'col_6',
      current_owner_nic: '123456788V',
      requested_new_owner_nic: 'nil',
      boundaries: [[0,100],[0,200],[100,200],[100,100]],
      surveyor_vote: 'S002',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });
    let land3: Land = new Land({
      id: '0000002',
      parent_land_id: 'nil',
      extent: 20000,
      rlregistry: 'col_7',
      current_owner_nic: '123456787V',
      requested_new_owner_nic: 'nil',
      boundaries: [[0,200],[0,300],[100,300],[100,200]],
      surveyor_vote: 'S003',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });
    let land4: Land = new Land({
      id: '0000003',
      parent_land_id: 'nil',
      extent: 10000,
      rlregistry: 'col_7',
      current_owner_nic: '123456786V',
      requested_new_owner_nic: 'nil',
      boundaries: [[100,0],[100,100],[200,100],[200,0]],
      surveyor_vote: 'S003',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });
    let land5: Land = new Land({
      id: '0000004',
      parent_land_id: 'nil',
      extent: 10000,
      rlregistry: 'col_7',
      current_owner_nic: '123456785V',
      requested_new_owner_nic: 'nil',
      boundaries: [[100,100],[100,200],[200,200],[200,100]],
      surveyor_vote: 'S004',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });
    let land6: Land = new Land({
      id: '0000005',
      parent_land_id: 'nil',
      extent: 30000,
      rlregistry: 'col_8',
      current_owner_nic: '123456784V',
      requested_new_owner_nic: 'nil',
      boundaries: [[200,0],[200,300],[300,300],[300,0]],
      surveyor_vote: 'S004',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });

    let mockData = [land1, land2, land3, land4, land5, land6];
    await Promise.all(mockData.map(land => land.save()));
    return "mock data successfully initialized";
  }

  // Register RLR
  @Invokable()
  public async registerRLR(
    @Param(yup.string()) id: string,
    @Param(yup.string()) name: string
  ) {
    if(!this.checkOrgPriviledges('rlr')) {
      throw new Error('User has no priviledges to execute this action');
    }
    // Retrieve to see if exists
    const existing = await RLR.getOne(id);

    if (!existing || !existing.id) {
      let rlr = new RLR();
      rlr.id = id;
      rlr.name = name;
      rlr.fingerprint = this.sender;
      rlr.active_status = true;

      await rlr.save();
    } else {
      throw new Error('Error : Identity exists already');
    }
  }

  // Register Notary
  @Invokable()
  public async registerNotary(
    @Param(yup.string()) id: string,
    @Param(yup.string()) fullname: string,
    @Param(yup.string()) nic: string,
    @Param(yup.string()) registered_rlr_id: string,
  ) {
    if(!this.checkOrgPriviledges('notary')) {
      throw new Error('User has no priviledges to execute this action');
    }
    // Retrieve to see if exists
    const existing = await Notary.getOne(id);

    if (!existing || !existing.id) {
      let notary = new Notary();
      notary.id = id;
      notary.fullname = fullname;
      notary.nic = nic;
      notary.registered_rlr_id = registered_rlr_id;
      notary.fingerprint = this.sender;
      notary.active_status = true;

      await notary.save();
    } else {
      throw new Error('Error : Identity exists already');
    }
  }

  // Get land information by ID
  @Invokable()
  public async queryLand(@Param(yup.string()) id: string): Promise<Land> {
    return Land.getOne(id);
  }

  // Get all lands information
  @Invokable()
  public async queryAllLands(): Promise<Land[]> {
    return Land.getAll();
  }

  // Create land - for internal use only
  @Invokable()
  private async createLand(@Param(Land) land: Land) {
    await land.save();
    return "successfully land created";
  }

  // Change land ownership
  @Invokable()
  public async changeLandOwner(@Param(yup.string()) id: string) {
    if(this.tx.identity.getMSPID() === 'org3MSP') {
      let land = await Land.getOne(id);
      if (land.surveyor_vote != 'nil' && land.notary_vote != 'nil' && land.current_owner_vote != 'nil') {
        throw new Error("Transaction not permitted by all the required parties yet.");
      }
      land.current_owner_nic = land.requested_new_owner_nic;
      land.requested_new_owner_nic = 'nil';
      land.notary_vote = 'nil';
      land.current_owner_vote = 'nil';
      await land.save();
      return "Successfully changed the land ownership";
    } else {
      throw new Error("Authorization failed");
    }
  }

  // Voting by surveyor
  @Invokable()
  public async voteSurveyor(
    @Param(yup.string()) id: string, 
    @Param(yup.string()) surveyorId: string) {
    if(this.tx.identity.getMSPID() === 'org1MSP') {
      let land = await Land.getOne(id);
      land.surveyor_vote = surveyorId;
      await land.save();
      return "Surveyor vote succesfully submitted";
    } else {
      throw new Error("Authorization failed");
    }
  }

  // Voting by notary
  @Invokable()
  public async voteNotary(
    @Param(yup.string()) id: string,
    @Param(yup.string()) notaryId: string,
    @Param(yup.string()) newOwnerNIC: string) {
    if(this.tx.identity.getMSPID() === 'org2MSP') {
      let land = await Land.getOne(id);
      land.notary_vote = notaryId;
      land.requested_new_owner_nic = newOwnerNIC;
      await land.save();
      return "Notary vote succesfully submitted";
    } else {
      throw new Error("Authorization failed");
    }
  }

  // Voting by current owner
  @Invokable()
  public async voteCurrentOwner(
    @Param(yup.string()) id: string, 
    @Param(yup.string()) ownerVote: string) {
    if(this.tx.identity.getMSPID() === 'org3MSP') {
      let land = await Land.getOne(id);
      land.current_owner_vote = ownerVote;
      await land.save();
      return "Current owner vote succesfully submitted";
    } else {
      throw new Error("Authorization failed");
    }
  }

  // Get the history records for a land by ID
  @Invokable()
  public async getHistoryForLand(@Param(yup.string()) id: string): Promise<History<Land>[]> {
    if(this.tx.identity.getMSPID() === 'org2MSP' || this.tx.identity.getMSPID() === 'org3MSP') {
      let land = await Land.getOne(id);
      return land.history();
    } else {
      throw new Error("Authorization failed");
    }
  }

  private checkOrgPriviledges(org: string) {
    if(org == 'rlr') {
      return this.tx.identity.getMSPID() === 'org1MSP';
    } 
    if(org == 'surveyor') {
      return this.tx.identity.getMSPID() === 'org2MSP';
    }
    if(org == 'notary') {
      return this.tx.identity.getMSPID() === 'org3MSP';
    } 
  }
}