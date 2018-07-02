'use strict';
const chai = require('chai');
const assert = chai.assert;

const Servereless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');

const {EnvironmentNotationManager} = require('./mock/env-manager');
const enm = new EnvironmentNotationManager();

const ServerlessPlugin = require('../index');

/**
 * Testing the plugin when the custom options are specified in array form:
 * ```yaml
 * custom:
 *  announcer:
 *    ...
 * ```
 */


describe('ServerlessPlugin Testing - Object', function() {
  let sls;

  /**
   * Initialize the mock serverless configuration
   */
  before(() => {
    return new Promise((_res) => {
      sls = new Servereless();
      sls.init().then(() => {
        // Sets the sls custom object notation to be used
        enm.setNotation('object');
        sls.setProvider('aws', new AwsProvider(sls));
        sls.variables.populateService();
        _res(sls);
      });
    });
  });

  it('Loaded custom options as an object from serverless.yml', () => {
    assert.isNotEmpty(sls.service.custom);
    assert.isObject(sls.service.custom);
    assert.isObject(sls.service.custom.announcer);
  });

  it('Retreives the correct announcer configuration from object form', () => {
    const slp = new ServerlessPlugin(sls, {});
    const announcerOptions = slp.getAnnouncerConfiguration(sls.service, sls);
    assert.isNotEmpty(announcerOptions);
    assert.isNotEmpty(announcerOptions.contract);
    assert.isString(announcerOptions.hook);
  });
});
