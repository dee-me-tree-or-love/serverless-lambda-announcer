const {Configs} = require('./configs');
const {EnvironmentManager} = require('./env-manager');


const resolveExp = () => {
  /**
 * Get the notation from the process
 */
  const envMan = new EnvironmentManager();
  const notation = envMan.getNotation();
  /**
 * Resolve respective configuration
 */
  const configs = new Configs({webhook: envMan.resovleWebhook()});
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

  return exp;
};

module.exports = resolveExp;
