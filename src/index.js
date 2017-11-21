
const fs = require('fs');
const os = require('os');

const agent = require('./agent');

/**
 * Setup Global FXPM object
 * Used to store important information, functions,
 * utilities and other fun stuff to be accessed throughout
 * the agent.
 */
global.FXPM = {};

/**
 * Set FXPM.RootDir to the FXPM root directory. This will be
 * used for cache, config files, databases, etc.
 */
FXPM.RootDir = os.homedir() + '/.fxpm';
FXPM.LogDir = FXPM.RootDir + '/logs';

fs.exists(FXPM.RootDir, (doesExist) => {
  if (!doesExist) {
    fs.mkdir(FXPM.RootDir, (err) => {
      if (!err) {
        console.log(`Successfully created FXPM RootDir at ${FXPM.RootDir}`);
      } else {
        throw new Error('Error while creating the FXPM Root directory. '
          + 'Please ensure you have proper permissions to the necessary directoy.');
      }
    })
  }

  fs.exists(FXPM.LogDir, (doesExist) => {
    if(!doesExist) {
      fs.mkdir(FXPM.LogDir, (err) => {
        console.log(`Successfully created FXPM LogDir at ${FXPM.LogDir}`);
      })
    }

    agent.startAgent();
  })
});
