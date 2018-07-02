/**
 * Class to manage the shared env variables
 * Used to alter the notation settings used to resolve the `custom` options
 */
class EnvironmentNotationManager {
  /**
   * Sets the shared environment variable name
   */
  constructor() {
    this._VARIABLE_NAME = '_NOTATION';
  }

  /**
   * Set the custom notation in the process
   * @param {String} notation
   */
  setNotation(notation) {
    if (typeof notation === 'string') {
      process.env[this._VARIABLE_NAME] = notation;
    } else {
      console.warn('EnvironmentManager: attempted to assign non string value');
    }
  }

  /**
   * Returns the currently set notation for the process
   * @return {String}
   */
  getNotation() {
    return process.env[this._VARIABLE_NAME];
  }
}


module.exports = {EnvironmentNotationManager};
