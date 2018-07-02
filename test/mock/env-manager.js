/**
 * Class to manage the shared env variables
 */
class EnvironmentManager {
  /**
   * Sets the shared environment variable name
   */
  constructor() {
    this._NOTATION_VARIABLE_NAME = '_NOTATION';
    this._HOOK_VARIABLE_NAME = '_WEB_HOOK';
    // Set the default webhook value
    this._DEFAULT_HOOK = 'https://webhook.site/f2ddff94-1e1b-4503-b2d9-291ab944aac5';
  }

  /**
   * Set the custom notation in the process
   * @param {string} notation
   */
  setNotation(notation) {
    if (typeof notation === 'string') {
      process.env[this._NOTATION_VARIABLE_NAME] = notation;
    } else {
      console.warn('EnvironmentManager: attempted to assign non string value');
    }
  }

  /**
   * Returns the currently set notation for the process
   * @return {string}
   */
  getNotation() {
    return process.env[this._NOTATION_VARIABLE_NAME];
  }

  /**
   * Returns the webhook string set in the environment
   * @return {string}
   */
  resovleWebhook() {
    if (!process.env[this._HOOK_VARIABLE_NAME]) {
      process.env[this._HOOK_VARIABLE_NAME] = this._DEFAULT_HOOK;
    }
    return process.env[this._HOOK_VARIABLE_NAME] || this._DEFAULT_HOOK;
  }
}


module.exports = {EnvironmentManager};
