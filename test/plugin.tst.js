'use strict';
const chai = require('chai');
const assert = chai.assert;

const request = require('request');
const Servereless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');

const ServerlessPlugin = require('../index');


describe('ServerlessPlugin Testing', function() {
  let sls;

  /**
   * Initialize the mock serverless configuration
   */
  before(() => {
    return new Promise((_res) => {
      sls = new Servereless();
      sls.init().then(() => {
        sls.setProvider('aws', new AwsProvider(sls));
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

  it('Loaded the custom configs from serverless.yml', () => {
    console.log(sls.service.custom);
    assert.isNotEmpty(sls.service.custom);
  });

  /**
   * See README.md - Configuration
   */
  it('Resolves announcer configuration specified as Array', () => {

  });
});
