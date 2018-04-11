'use strict';

const LambdaInfo = require('./lib/lambda-info');

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.service = this.serverless.service;
    this.provider = this.serverless.getProvider('aws');
    this.servicePath = this.serverless.config.servicePath || '';

    this.hooks = {
      // 'before:deploy:deploy': this.debug.bind(this),
      // 'after:deploy:deploy': this.debug.bind(this),
      'after:aws:info:displayEndpoints': this.debug.bind(this),
      // 'before:aws:deploy:finalize:cleanup': this.debug.bind(this),
    };
  }

  debug() {
    const sls = this.serverless;
    return LambdaInfo.getLambdaInfo(sls)
      .then((info) => {
        sls.cli.log("quark")
        sls.cli.consoleLog(info);
      })
      .catch((error) => {
        sls.cli.log(error);
      });
  }
}

module.exports = ServerlessPlugin;
