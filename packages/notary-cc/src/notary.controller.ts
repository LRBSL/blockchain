import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param,
  BaseStorage
} from '@worldsibu/convector-core';

import { Notary } from './notary.model';
import { ClientIdentity } from 'fabric-shim';

@Controller('notary')
export class NotaryController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async register(
    @Param(yup.string()) id: string,
    @Param(yup.string()) name: string
  ) {
    // Retrieve to see if exists
    const existing = await Notary.getOne(id);

    if (!existing || !existing.id) {
      let notary = new Notary();
      notary.id = id;
      notary.name = name || id;
      notary.msp = this.tx.identity.getMSPID();
      // Create a new identity
      notary.identities = [{
        fingerprint: this.sender,
        status: true
      }];
      console.log(JSON.stringify(notary));
      await notary.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  @Invokable()
  public async get(
    @Param(yup.string()) id: string
  ) {
    const existing = await Notary.getOne(id);
    if (!existing || !existing.id) {
      throw new Error(`No identity exists with that ID ${id}`);
    }
    return existing;
  }
}