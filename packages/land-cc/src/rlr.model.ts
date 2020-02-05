import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate,
  FlatConvectorModel
} from '@worldsibu/convector-core-model';

export class RLR extends ConvectorModel<RLR> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.lrbsl.rlr';

  // location-wise name
  @Required()
  @Validate(yup.string())
  public name: string;

  @Validate(yup.boolean())
  @Required()
  active_status: boolean;

  @Validate(yup.string())
  @Required()
  fingerprint: string;
}
