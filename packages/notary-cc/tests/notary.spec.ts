// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Notary, NotaryController } from '../src';

describe('Notary', () => {
  let adapter: MockControllerAdapter;
  let notaryCtrl: ConvectorControllerClient<NotaryController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    notaryCtrl = ClientFactory(NotaryController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'NotaryController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');
  });
  
  it('should create a default model', async () => {
    const modelSample = new Notary({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await notaryCtrl.$withUser('Test').create(modelSample);
  
    const justSavedModel = await adapter.getById<Notary>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});