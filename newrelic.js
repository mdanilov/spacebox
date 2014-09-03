/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

// TODO: add condition for production
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['Spacebox-test'],
  /**
   * Your New Relic license key.
   */
  license_key : '5b27a48269fa1d8b6446557b550df099960d8400',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'info'
  }
};
