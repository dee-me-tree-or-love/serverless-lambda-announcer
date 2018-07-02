/**
 * Configuration holding class
 */
class Configs {
  /**
   * Initializes the configuration holder object
   */
  constructor() {
    this.announcerConfigs = {
      announcer: {
        hook: 'https://webhook.site/f2ddff94-1e1b-4503-b2d9-291ab944aac5',
        contract: {
          announcer_test: {
            reponse: {
              body: {
                properties: {
                  beardLength: 'number',
                  beardType: 'string',
                },
              },
            },
          },
        },
      },
    };

    this._customArray = [this.announcerConfigs];
    this._customObject = {announcer: this.announcerConfigs.announcer};
    this._customOptions = this._customObject;
  }

  /**
   * Set the custom options of the config object
   * @param {any} custom
   */
  setActiveCustom(custom) {
    this._customOptions = custom;
  }

  /**
   * Returns the active custom options set for the configurations
   * @return {any}
   */
  get custom() {
    return this._customOptions;
  }

  /**
   * Retrieves the default setting for the configs
   * By default it is set to the array representation
   * @return {Array}
   */
  get default() {
    return this.arrayNotation;
  }

  /**
   * Returns the settings specified in an object
   * @return {Object}
   */
  get objectNotation() {
    return this._customObject;
  }

  /**
   * Returns the settings specified in an array
   * @return {Array}
   */
  get arrayNotation() {
    return this._customArray;
  }
}


module.exports = {Configs};
