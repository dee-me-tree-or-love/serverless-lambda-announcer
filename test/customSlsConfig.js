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

    this.customArray = [this.announcerConfigs];
    this.customObject = {announcer: this.announcerConfigs.announcer};
    this._customOptions = this.customObject;
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
}


const config = new Configs();

module.exports = {
  config,
};
