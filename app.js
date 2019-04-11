var cron = require('node-cron');
var http = require('http');
var config = require('./src/config');
var network = require('./src/network');
var helpers = require('./src/helpers');

http.createServer().listen(process.env.PORT || 3000);

helpers.validateEnvironmentVariables();

var environments = config.environments();
helpers.logInfo("App started...");

  cron.schedule(process.env.CRON_EXPRESSION, function () {
    if (typeof environments !== "undefined" && environments.length > 0) {
          network.getValidToken( () => {
          environments.forEach( (environment) => {
              environment.deleteBackups();
            environment.createBackups();
          });
        });
      }
  });




