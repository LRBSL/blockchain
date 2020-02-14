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

@Controller('land')
export class LandController extends ConvectorController<ChaincodeTx> {

  // Initialize mock data
  @Invokable()
  public async init() {
    if (!this.checkOrgPriviledges('rlr')) {
      throw new Error('User has no priviledges to execute this action');
    }
    let land1: Land = new Land({
      id: '0000000',
      parent_land_id: 'nil',
      extent: 10000,
      rlregistry: 'col_6',
      current_owner_nic: '123456789V',
      requested_new_owner_nic: 'nil',
      boundaries: [[0, 0], [0, 100], [100, 100], [100, 0]],
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
      boundaries: [[0, 100], [0, 200], [100, 200], [100, 100]],
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
      boundaries: [[0, 200], [0, 300], [100, 300], [100, 200]],
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
      boundaries: [[100, 0], [100, 100], [200, 100], [200, 0]],
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
      boundaries: [[100, 100], [100, 200], [200, 200], [200, 100]],
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
      boundaries: [[200, 0], [200, 300], [300, 300], [300, 0]],
      surveyor_vote: 'S004',
      notary_vote: 'nil',
      current_owner_vote: 'nil'
    });

    let mockData = [land1, land2, land3, land4, land5, land6];
    await Promise.all(mockData.map(land => land.save()));
    return "mock data successfully initialized";
  }

  // Get land information by ID
  @Invokable()
  public async queryLand(@Param(yup.string()) id: string): Promise<Land> {
    return Land.getOne(id);
  }

  // Get all lands information
  @Invokable()
  public async queryAllLands(): Promise<Land[]> {
    if (!this.checkOrgPriviledges('rlr')) {
      throw new Error('User has no priviledges to execute this action');
    }
    return Land.getAll();
  }


  // Change land ownership
  @Invokable()
  public async changeLandOwner(@Param(yup.string()) id: string) {
    if (!this.checkOrgPriviledges('rlr')) {
      throw new Error('User has no priviledges to execute this action');
    }
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
  }

  // Voting by surveyor
  @Invokable()
  public async voteSurveyor(
    @Param(yup.string()) id: string,
    @Param(yup.string()) surveyorId: string) {
    if (!this.checkOrgPriviledges('surveyor')) {
      throw new Error('User has no priviledges to execute this action');
    }
    let land = await Land.getOne(id);
    land.surveyor_vote = surveyorId;
    await land.save();
    return "Surveyor vote succesfully submitted";
  }

  // Voting by notary
  @Invokable()
  public async voteNotary(
    @Param(yup.string()) id: string,
    @Param(yup.string()) notaryId: string,
    @Param(yup.string()) newOwnerNIC: string) {
    if (!this.checkOrgPriviledges('notary')) {
      throw new Error('User has no priviledges to execute this action');
    }
    let land = await Land.getOne(id);
    land.notary_vote = notaryId;
    land.requested_new_owner_nic = newOwnerNIC;
    await land.save();
    return "Notary vote succesfully submitted";
  }

  // Voting by current owner
  @Invokable()
  public async voteCurrentOwner(
    @Param(yup.string()) id: string,
    @Param(yup.string()) ownerVote: string) {
    if (!this.checkOrgPriviledges('rlr')) {
      throw new Error('User has no priviledges to execute this action');
    }
    let land = await Land.getOne(id);
    land.current_owner_vote = ownerVote;
    await land.save();
    return "Current owner vote succesfully submitted";
  }

  // Get the history records for a land by ID
  @Invokable()
  public async getHistoryForLand(@Param(yup.string()) id: string): Promise<History<Land>[]> {
    if (this.checkOrgPriviledges('surveyor')) {
      throw new Error('User has no priviledges to execute this action');
    }
    let land = await Land.getOne(id);
    return land.history();
  }

  // Get all lands information for a surveyor
  @Invokable()
  public async queryAllLandsForSurveyor(@Param(yup.string()) surveyorId: string): Promise<Land[]> {
    let land_set: Land[];
    let lands: Land[] = await Land.getAll();
    lands.forEach((land: Land) => {
      if (land.surveyor_vote == surveyorId) {
        land_set.push(land);
      }
    });
    return land_set;
  }

  // Get all lands information for a notary
  @Invokable()
  public async queryAllLandsForNotary(@Param(yup.string()) notaryId: string): Promise<Land[]> {
    let land_set: Land[];
    let lands: Land[] = await Land.getAll();
    lands.forEach((land: Land) => {
      if (land.notary_vote == notaryId) {
        land_set.push(land);
      }
    });
    return land_set;
  }

  // Get all lands information for a rlr
  @Invokable()
  public async queryAllLandsForRLR(@Param(yup.string()) rlrId: string): Promise<Land[]> {
    let land_set: Land[];
    let lands: Land[] = await Land.getAll();
    lands.forEach((land: Land) => {
      if (land.rlregistry == rlrId) {
        land_set.push(land);
      }
    });
    return land_set;
  }

  // Get all lands information for a rlr
  @Invokable()
  public async forkLand(
    @Param(yup.string()) id: string,
    @Param(Land) land1: Land,
    @Param(Land) land2: Land,
    @Param(yup.string()) surveyorId: string) {
    if (!this.checkOrgPriviledges('surveyor')) {
      throw new Error('User has no priviledges to execute this action');
    }

    let parent_land: Land = await Land.getOne(id);

    // check to confirm that all the coordinates are inside parent land
    land1.boundaries.forEach(point => {
      this.checkPointInsideLand(parent_land, point);
    });
    land2.boundaries.forEach(point => {
      this.checkPointInsideLand(parent_land, point);
    });

    // check to confirm that land coordinates are not overlapping
    land1.boundaries.forEach(point => {
      this.checkPointOutsideLand(land2, point);
    });
    land2.boundaries.forEach(point => {
      this.checkPointOutsideLand(land1, point);
    });

    // create new lands
    land1.id = parent_land.id + "1";
    land1.parent_land_id = parent_land.id;
    land1.current_owner_nic = parent_land.current_owner_nic;
    land1.requested_new_owner_nic = null;
    land1.rlregistry = parent_land.rlregistry;
    land1.surveyor_vote = surveyorId;
    land1.notary_vote = null;
    land1.current_owner_vote = null;
    land1.extent = this.calculateArea([land1.boundaries[0], land1.boundaries[1], land1.boundaries[2], land1.boundaries[3]]);

    land2.id = parent_land.id + "2";
    land2.parent_land_id = parent_land.id;
    land2.current_owner_nic = parent_land.current_owner_nic;
    land2.requested_new_owner_nic = null;
    land2.rlregistry = parent_land.rlregistry;
    land2.surveyor_vote = surveyorId;
    land2.notary_vote = null;
    land2.current_owner_vote = null;
    land2.extent = this.calculateArea([land2.boundaries[0], land2.boundaries[1], land2.boundaries[2], land2.boundaries[3]]);

    await land1.save();
    await land2.save();

    return {
      land1: land1.id,
      land2: land2.id
    }
  }

  private checkPointInsideLand(land: Land, p: number[]) {
    let landArea = this.calculateArea([land.boundaries[0], land.boundaries[1], land.boundaries[2], land.boundaries[3]]);
    let area1 = this.calculateArea([land.boundaries[0], land.boundaries[1], p]);
    let area2 = this.calculateArea([land.boundaries[1], land.boundaries[2], p]);
    let area3 = this.calculateArea([land.boundaries[2], land.boundaries[3], p]);
    let area4 = this.calculateArea([land.boundaries[3], land.boundaries[0], p]);
    if (landArea < area1 + area2 + area3 + area4) {
      throw new Error('Some coordinates are incorrect. Check again.');
    }
  }

  private checkPointOutsideLand(land: Land, p: number[]) {
    let landArea = this.calculateArea([land.boundaries[0], land.boundaries[1], land.boundaries[2], land.boundaries[3]]);
    let area1 = this.calculateArea([land.boundaries[0], land.boundaries[1], p]);
    let area2 = this.calculateArea([land.boundaries[1], land.boundaries[2], p]);
    let area3 = this.calculateArea([land.boundaries[2], land.boundaries[3], p]);
    let area4 = this.calculateArea([land.boundaries[3], land.boundaries[0], p]);
    if (landArea >= area1 + area2 + area3 + area4) {
      throw new Error('Land coordinates are overlapping. Check again.');
    }
  }

  private calculateArea(points, signed?: boolean) {
    var l = points.length
    var det = 0
    var isSigned = signed || false

    function normalize(point) {
      if (!Array.isArray(point)) return point
      return {
        x: point[0],
        y: point[1]
      }
    }

    points = points.map(normalize)
    if (points[0] != points[points.length - 1])
      points = points.concat(points[0])

    for (var i = 0; i < l; i++)
      det += points[i].x * points[i + 1].y
        - points[i].y * points[i + 1].x
    if (isSigned)
      return det / 2
    else
      return Math.abs(det) / 2
  }

  private checkOrgPriviledges(org: string) {
    if (org == 'rlr') {
      return this.tx.identity.getMSPID() === 'org1MSP';
    }
    if (org == 'surveyor') {
      return this.tx.identity.getMSPID() === 'org2MSP';
    }
    if (org == 'notary') {
      return this.tx.identity.getMSPID() === 'org3MSP';
    }
  }
}