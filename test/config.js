const {Configs} = require('./configs');
const {EnvironmentNotationManager} = require('./env-manager');

/**
 * Get the notation from the process
 */
const enm = new EnvironmentNotationManager();
const notation = enm.getNotation();

/**
 * Resolve respective configuration
 */
const configs = new Configs;
let exp = configs.default;

switch (notation) {
  case 'array':
    console.log('config.js: using array notation');
    exp = configs.arrayNotation;
    break;
  case 'object':
    console.log('config.js: using object notation');
    exp = configs.objectNotation;
    break;
  default:
    console.log('config.js: using default notation');
    exp = configs.default;
    break;
}

module.exports = () => exp;
