'use strict';
const chai = require('chai');
chai.use(require('chai-json-schema'));
const assert = chai.assert;

const Servereless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');

const {EnvironmentManager} = require('./mock/env-manager');
const envMan = new EnvironmentManager();

const LambdaInfo = require('../lib/lambda-info');

const functionInfoSchema = {
  name: {type: 'string', required: true},
  events: {type: 'array', required: true},
  http: {type: 'array', require: true},
  deployedName: {type: 'string', required: true},
};


describe('Lambda Info Testing', function() {
  let sls;

  /**
   * Initialize the mock serverless configuration
   */
  before(() => {
    return new Promise((_res) => {
      // set's the sls custom default notation to be used
      sls = new Servereless();
      sls.init().then(() => {
        envMan.setNotation('default');
        sls.setProvider('aws', new AwsProvider(sls));
        sls.variables.populateService();
        _res(sls);
      });
    });
  });

  /**
   * Applicable functions should be for aws.
   * The only method noted in this plugin is the http event.
   */
  it('retrieves information about all the functions in sls.yml', () => {
    const service = sls.service;
    const provider = sls.getProvider('aws');
    const funcs = LambdaInfo.getFunctionInfo(service, provider);
    assert.isNotEmpty(funcs);
    assert.isArray(funcs);
  });

  /**
   * Applicable functions should be for aws.
   * The only method noted in this plugin is the http event.
   */
  it('retrieved function information follows the schema', () => {
    const service = sls.service;
    const provider = sls.getProvider('aws');
    const funcs = LambdaInfo.getFunctionInfo(service, provider);
    assert.isNotEmpty(funcs);
    assert.isArray(funcs);
    funcs.forEach((func) => {
      assert.jsonSchema(func, functionInfoSchema);
    });
  });
});
