'use strict';

const request = require('request');

const LambdaInfo = require('./lib/lambda-info');
const AnnouncerException = require('./lib/announcer-exception');

/* eslint-disable require-jsdoc */
// TODO: write proper jsdoc
class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.service = this.serverless.service;
    this.provider = this.serverless.getProvider('aws');
    this.servicePath = this.serverless.config.servicePath || '';

    this.hooks = {
      'after:deploy:deploy': this.handle.bind(this),
    };
  }

  /**
   * Handles the announcement of the service
   * @return {Promise}
   */
  handle() {
    const sls = this.serverless;
    sls.cli.consoleLog('----- Lambda Announcer -----');

    const announcer = this.resolveAnnouncerHook(this.service, sls);
    const contract = this.resolveContractDefinition(this.service, sls);

    if (!announcer.hook) {
      sls.cli.log('!_Announcer hook is not specified correctly_!');
      return;
    }
    return LambdaInfo
      .getLambdaInfo(sls)

      .then((info) => {
        this.outputLambdaInfo(sls, info, announcer);
        return (contract) ? this.mergeInfoAndContract(info, contract) : info;
      })

      .then((info) => {
        return this.announce(announcer, info);
      })

      .then((result) => {
        sls.cli.log(`Announcement result: ${result.statusCode}`);
        return true;
      })

      .then((result) => {
        sls.cli.consoleLog(`----- ----- ----- -----`);
      })

      .catch((error) => {
        sls.cli.log(error);
      });
  }

  /**
   * Fires the hook specified in the announcer with the data passed as info
   * @param {{hook: String}} announcer
   * @param {Array} info
   * @return {Promise}
   */
  announce(announcer, info) {
    const options = {
      method: 'post',
      body: info,
      json: true,
      url: announcer.hook,
    };
    return new Promise((resolve, reject) => {
      request(options, (err, res) => {
        if (err) {
          reject(new AnnouncerException('Failed to post an announcement'));
          return;
        }
        resolve(res);
        return;
      });
    }
    );
  }

  /**
   * Gathers the configuration of the announcer from serverless configuration
   * @param {Object} service
   * @param {Object} sls
   * @return {Object}
   */
  getAnnouncerConfiguration(service, sls) {
    // service.custom can be an object or an array
    const custom = service.custom;
    const properties = custom.announcer ? [custom.announcer] : service.custom;
    const announcers = properties
      // find the one settings defining the announcer
      .filter((s) => s.announcer)
      // map to only these settings to be on first level of depth
      .map((s) => s.announcer);
    if (announcers.length != 1) {
      sls.cli
        .consoleLog('!_Number of found announcer settings is not one..._!');
      return {};
    }
    return announcers.pop();
  }

  /**
   * Returns the hook specified in the announcer
   * @param {*} service
   * @param {*} sls
   * @return {{hook: String}}
   */
  resolveAnnouncerHook(service, sls) {
    const announcer = this.getAnnouncerConfiguration(service, sls);
    return {
      hook: announcer.hook || '',
    };
  }

  /**
   * Returns the contract specification from the serverless config
   * @param {*} service
   * @param {*} sls
   * @return {*}
   */
  resolveContractDefinition(service, sls) {
    // Currently uses internal endpoint documentation approach.
    const announcer = this.getAnnouncerConfiguration(service, sls);
    if (announcer.contract) {
      sls.cli.log('found contract');
      sls.cli.consoleLog(announcer.contract);
    } else {
      sls.cli.log('no contract found');
    }
    return announcer.contract || {};
  }

  /**
   * Merges the function information with related contract information (if any)
   * @param {Array} info
   * @param {*} contract
   * @return {Array}
   */
  mergeInfoAndContract(info, contract) {
    if (!contract) {
      return info;
    }
    return info.map((i) => {
      const functionContract = {contract: contract[`/${i.identifier}`]};

      if (!functionContract.contract) {
        // no matching contract found
        return i;
      } else {
        return Object.assign(functionContract, i);
      }
    });
  }

  /**
   * Prints the results of findings to the console.
   * @param {*} sls
   * @param {*} info
   * @param {*} announcer
   */
  outputLambdaInfo(sls, info, announcer) {
    sls.cli.log('Gathered Lambda Info for functions:');
    sls.cli.consoleLog(info.map((i) => {
      return i.name;
    }));
    sls.cli.log(`Announcing to: ${announcer.hook}`);
  }
}

module.exports = ServerlessPlugin;
