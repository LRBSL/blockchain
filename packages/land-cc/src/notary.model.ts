import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Notary extends ConvectorModel<Notary> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.lrbsl.notary';

  @Required()
  @Validate(yup.string())
  public fullname: string;

  @Required()
  @Validate(yup.string())
  public reg_id: string;

  @Required()
  @Validate(yup.string())
  public nic: string;

  @Required()
  @Validate(yup.string())
  public registered_rlr_id: string;

  @Validate(yup.boolean())
  @Required()
  active_status: boolean;

  @Validate(yup.string())
  @Required()
  fingerprint: string;
}
