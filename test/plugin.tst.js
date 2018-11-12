'use strict';
const chai = require('chai');
const assert = chai.assert;

const request = require('request');
const Servereless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');

const {EnvironmentManager} = require('./mock/env-manager');
const envMan = new EnvironmentManager();

const ServerlessPlugin = require('../index');

/**
 * Testing the plugin initialization
 */

describe('ServerlessPlugin Testing - Default Init', function() {
  let sls;

  /**
   * Initialize the mock serverless configuration
   */
  before(() => {
    return new Promise((_res) => {
      // Sets the sls custom default notation to be used
      sls = new Servereless();
      sls.init().then(() => {
        envMan.setNotation('default');
        sls.setProvider('aws', new AwsProvider(sls));
        sls.variables.populateService();
        _res(sls);
      });
    });
  });

  it('Loaded custom options as an array from serverless.yml', () => {
    assert.isNotEmpty(sls.service.custom);
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
});
