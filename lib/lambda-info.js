const AnnouncerException = require('./announcer-exception');
/* eslint-disable require-jsdoc */
module.exports = {

  getFunctionInfo(service, provider) {
    const funcs = [];

    // Retrieve the available information per function
    service.getAllFunctions().forEach((func) => {
      const functionInfo = {};
      functionInfo.name = func;

      functionInfo.events = service.getAllEventsInFunction(func);

      // Map only the http events
      functionInfo.http = functionInfo.events
        .filter((e) => e.http).map((e) => e.http);

      functionInfo.deployedName = `${
        service.service}-${provider.getStage()}-${func}`;
      funcs.push(functionInfo);
    });

    return funcs;
  },

  getStackInfo(provider, service) {
    const gatheredData = {
      info: {
        functions: [],
        endpoint: '',
        service: service.service,
        stage: provider.getStage(),
        region: provider.getRegion(),
        stack: provider.naming.getStackName(),
      },
      outputs: [],
    };

    const stackName = provider.naming.getStackName();

    // Get info from CloudFormation Outputs
    return provider.request('CloudFormation',
      'describeStacks',
      {StackName: stackName})
      .then((result) => {
        let outputs;

        if (result) {
          outputs = result.Stacks[0].Outputs;

          const serviceEndpointOutputRegex = provider.naming
            .getServiceEndpointRegex();

          // Outputs
          gatheredData.outputs = outputs;

          // Functions
          gatheredData.info.functions = this.getFunctionInfo(service, provider);

          // Endpoints
          outputs.filter((x) => x.OutputKey.match(serviceEndpointOutputRegex))
            .forEach((x) => {
              gatheredData.info.endpoint = x.OutputValue;
            });
        }
        return new Promise((resolve, reject) => {
          resolve(gatheredData);
        });
      });
  },

  prepareLambdaInformation(gatheredData) {
    const endpoint = gatheredData.info.endpoint;
    const serviceName = gatheredData.info.service;
    return gatheredData.info.functions
      .map((f) => {
        const func = {
          endpoints: [],
          name: `${serviceName} : ${f.name}`,
          identifier: f.name,
          events: f.events,
        };
        func.endpoints = f.http.map((e) => {
          // Prepare the path to join with the endpoint
          const path = (e.path !== '/')
            ? `/${e.path.split('/').filter((p) => p !== '').join('/')}` : '';
          return {
            method: e.method,
            path: `${endpoint}${path}`,
          };
        });
        return func;
      });
  },

  getLambdaInfo(serverless) {
    const provider = serverless.getProvider('aws');
    const service = serverless.service;
    return this.getStackInfo(provider, service)
      .then((gatheredData) => {
        if (!gatheredData) {
          throw new AnnouncerException('gathered data is empty');
        }
        return this.prepareLambdaInformation(gatheredData);
      });
  },
};
