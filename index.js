'use strict';

const request = require('request');

const LambdaInfo = require('./lib/lambda-info');
const AnnouncerException = require('./lib/announcer-exception');

/* eslint-disable require-jsdoc */
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

  resolveAnnouncerParameters(service, sls) {
    // service.custom is an array
    const announcers = service.custom
      // find the one settings defining the announcer
      .filter((s) => s.announcer)
      // map to only these settings to be on first level of depth
      .map((s) => s.announcer);
    if (announcers.length != 1) {
      sls.cli
        .consoleLog('!_Number of found announcer settings is not one..._!');
      return {};
    }
    return {
      hook: announcers[0].hook || '',
    };
  }

  handle() {
    const sls = this.serverless;
    const announcer = this.resolveAnnouncerParameters(this.service, sls);
    if (!announcer.hook) {
      sls.cli.log('!_Announcer hook is not specified correctly_!');
      return;
    }
    return LambdaInfo.getLambdaInfo(sls)
      .then((info) => {
        sls.cli.log('Gathered Lambda Info for functions:');
        sls.cli.consoleLog(info.map((i) => {
          return i.name;
        }));
        sls.cli.log(`Announcing to: ${announcer.hook}`);
        return this.announce(announcer, info);
      })
      .then((result) => {
        sls.cli.log(`Announcement result: ${result.statusCode}`);
      })
      .catch((error) => {
        sls.cli.log(error);
      });
  }
}

module.exports = ServerlessPlugin;
