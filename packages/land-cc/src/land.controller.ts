import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Land } from './land.model';

@Controller('land')
export class LandController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Land)
    land: Land
  ) {
    await land.save();
  }
}