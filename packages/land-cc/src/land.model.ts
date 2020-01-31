import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Land extends ConvectorModel<Land> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.lrbsl.land';

  // ID attribute is already defined

  // Parent land 
  @Required()
  @Validate(yup.string())
  public parent_land_id: string;

  // Extent
  @Required()
  @Validate(yup.number())
  public extent: number;

  // RL Registry
  @Required()
  @Validate(yup.string())
  public rlregistry: string;

  // Current owner NIC
  @Required()
  @Validate(yup.string())
  public current_owner_nic: string;

  // Requested new owner NIC
  @Validate(yup.string())
  public requested_new_owner_nic: string;

  // Land boundaries
  @Required()
  @Validate(yup.array().of(yup.array().of(yup.number())))
  public boundaries: number[][];

  // Votes for transaction

  // Surveyor vote
  @Required()
  @Validate(yup.string())
  public surveyor_vote: string;

  // Notary vote
  @Required()
  @Validate(yup.string())
  public notary_vote: string;

  // Current owner vote
  @Required()
  @Validate(yup.string())
  public current_owner_vote: string;

}
