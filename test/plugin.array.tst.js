'use strict';
const chai = require('chai');
const assert = chai.assert;

const Servereless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');

const {EnvironmentManager} = require('./mock/env-manager');
const envMan = new EnvironmentManager();

const ServerlessPlugin = require('../index');

/**
 * Testing the plugin when the custom options are specified in array form:
 * ```yaml
 * custom:
 *  - announcer:
 *    ...
 * ```
 */


describe('ServerlessPlugin Testing - Array', function() {
  let sls;

  /**
   * Initialize the mock serverless configuration
   */
  before(() => {
    return new Promise((_res) => {
      sls = new Servereless();
      sls.init().then(() => {
        // Sets the sls custom array notation to be used
        envMan.setNotation('array');
        sls.setProvider('aws', new AwsProvider(sls));
        sls.variables.populateService();
        _res(sls);
      });
    });
  });

  it('Loaded custom options as an array from serverless.yml', () => {
    assert.isNotEmpty(sls.service.custom);
    assert.isArray(sls.service.custom);
  });

  it('Retreives the correct announcer configuration from array form', () => {
    const slp = new ServerlessPlugin(sls, {});
    const announcerOptions = slp.getAnnouncerConfiguration(sls.service, sls);
    assert.isNotEmpty(announcerOptions);
    assert.isNotEmpty(announcerOptions.contract);
    assert.isString(announcerOptions.hook);
  });

  it('Retreives the correct announcer hook', () => {
    const slp = new ServerlessPlugin(sls, {});
    const hookObject = slp.resolveAnnouncerHook(sls.service, sls);
    assert.isNotEmpty(hookObject);
    const hook = hookObject.hook;
    assert.equal(hook, envMan.resovleWebhook());
  });
});
