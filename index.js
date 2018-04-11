'use strict';

const request = require('request');

const LambdaInfo = require('./lib/lambda-info');

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.service = this.serverless.service;
    this.provider = this.serverless.getProvider('aws');
    this.servicePath = this.serverless.config.servicePath || '';

    this.hooks = {
      'after:deploy:deploy': this.debug.bind(this),
    };
  }

  /// http://requestbin.fullcontact.com/uo9xoouo
  announce(info) {
    const options = {
      method: 'post',
      body: info,
      json: true,
      url: 'http://requestbin.fullcontact.com/uo9xoouo'
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res) => {
        if (err) {
          reject(new Error('bla'));
          return;
        }
        resolve(res);
        return;
      })
    }
    );
  }

  handle() {
    const sls = this.serverless;
    return LambdaInfo.getLambdaInfo(sls)
      .then((info) => {
        sls.cli.log("quark")
        sls.cli.consoleLog(info);
        return info;
      })
      .then((info) => {
        return this.announce(info);
      })
      .then((result) => {
        sls.cli.log("quark")
        sls.cli.consoleLog(result);
      })
      .catch((error) => {
        sls.cli.log(error);
      });
  }
}

module.exports = ServerlessPlugin;
