import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Surveyor extends ConvectorModel<Surveyor> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.lrbsl.surveyor';

  @Required()
  @Validate(yup.string())
  public fullname: string;

  @Required()
  @Validate(yup.string())
  public reg_id: string;

  @Required()
  @Validate(yup.string())
  public nic: string;

  @Validate(yup.boolean())
  @Required()
  active_status: boolean;

  @Validate(yup.string())
  @Required()
  fingerprint: string;
}
