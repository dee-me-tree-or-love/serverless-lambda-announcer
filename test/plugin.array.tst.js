'use strict';
const chai = require('chai');
const assert = chai.assert;

const request = require('request');
const Servereless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');

const {EnvironmentNotationManager} = require('./env-manager');
const enm = new EnvironmentNotationManager();

const ServerlessPlugin = require('../index');


describe('ServerlessPlugin Testing', function() {
  let sls;

  /**
   * Initialize the mock serverless configuration
   */
  before(() => {
    return new Promise((_res) => {
      // set's the sls custom default notation to be used
      sls = new Servereless();
      sls.init().then(() => {
        enm.setNotation('default');
        sls.setProvider('aws', new AwsProvider(sls));
        sls.variables.populateService();
        _res(sls);
      });
    });
  });

  it('Uses `request` package by default', () => {
    const slp = new ServerlessPlugin(sls, {});
    assert.property(slp, 'httpRequester');
    assert.deepEqual(slp.httpRequester, request);
  });

  it('A function is hooked to after:deploy:deploy', () => {
    const hookKey = 'after:deploy:deploy';
    const slp = new ServerlessPlugin(sls, {});
    assert.property(slp, 'hooks');
    assert.property(slp.hooks, hookKey);
    assert.isFunction(slp.hooks[hookKey]);
  });

  it('Loaded default settings for custom configs from serverless.yml', () => {
    assert.isNotEmpty(sls.service.custom);
    assert.isArray(sls.service.custom);
  });
});
