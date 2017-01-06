var Environment = require('./environment');

  // add your own environments with services
  // you need the service name and the service guid

  // minimum one environment is necessary with one service

exports.environments = function environments() {
  var environments = [];

  // sample for environment for development space, remove or add your own values
  var environmentDev = new Environment("sample-dev");
  environmentDev.addServiceForBackup("sample-mariadb-dev", "1234567-bbbb-cccc-dddd-123456789012");
  environmentDev.addServiceForBackup("sample-mongoDB-dev", "1234567-bbbb-cccc-dddd-123456789012");
  environments.push(environmentDev);

  // sample for environment for production space, remove or add your own values
  var environmentProd = new Environment("sample-prod");
  environmentProd.addServiceForBackup("sample-mariadb-prod", "1234567-bbbb-cccc-dddd-123456789012");
  environmentProd.addServiceForBackup("sample-mongoDB-prod", "1234567-bbbb-cccc-dddd-123456789012");
  environments.push(environmentProd);

  return environments;
}
