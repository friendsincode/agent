
const winston = require('winston');
const Low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const prompt = require('prompt');

module.exports = {

  async startProcessManager() {

  },

  async startLogger() {
    FXPM.Logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          colorize: true,
          timestamp: true,
          prettyPrint: true,
        }),
        new winston.transports.File({ 
          filename: `${FXPM.RootDir}/logs/agent.log`, 
          colorize: true,
          prettyPrint: true,
        }),
      ],
    });
  },

  async startConfig() {
    /**
     * Launch the FXPM.Config with default values. These can be set manually,
     * or you will be prompted to provide some of the data on first run.
     */
    const adapter = new FileSync(FXPM.RootDir + '/config.json');
    FXPM.Config = Low(adapter);
    FXPM.Config.defaults({
      manager: {
        host: null,
        apiKey: null,
      },
      redis: {
        host: null,
        port: null,
        user: null,
        password: null,
      },  
      host: {
        name: null,
        description: null,
      },  
      settings: {},
      flags: {},
    }).write();
    if (!FXPM.Config.get('manager.host').value()) {
      FXP.Logger.log('info', 'Configuration is not yet set. Prompting to complete configuration...');
      prompt.start();
      prompt.get({
        properties: {
          manager: {
            type: 'string',
            message: 'Manager must be a valid URL without the trailing slash.',
            required: true,
          },
          apiKey: {
            type: 'string',
            message: 'The apiKey must be a generated apiKey from your Manager interface.',
            required: true,
          },
          hostName: {
            type: 'string',
            message: 'The display name for your FXServer host. This is not the DNS hostname or computer name.',
            required: true,
          },
          description: {
            type: 'string',
            message: 'A description of your FXServer host. This is not required.',
            required: false,
          },
        },
      }, (err, result) => {
        if(err) {
          FXPM.Logger.log('error', err);
          process.exit(0);
        }

        FXPM.Config
          .set('manager.host', result.manager)
          .set('manager.apiKey', result.apiKey)
          .set('host.name', result.hostName)
          .set('host.description', result.description)
          .write();
        FXPM.Logger.log('info', `Configuration has been written to ${FXPM.RootDir}/config.json successfully.`);
      });
    }

    FXPM.Logger.log('info', 'Configuration is already in-place. Continuing...')
  },

  startAgent() {
    this.startLogger()
      .then(() => {
        this.startConfig()
          .then(() => {
            this.startProcessManager()
              .then(() => {
    
              })
          })
      })
      .catch(e => {
        FXPM.Logger.log('error', e.message);
      })
  }

}