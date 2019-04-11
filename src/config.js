var Environment = require('./environment');

// add your own environments with services
// you need the service name and the service guid
// If you click on the left pane on your bounded service in your space than the service guid is in the browser-url visible.

// minimum one environment is necessary with one service

exports.environments = function environments() {
    var environments = [];

    var environmentProd = new Environment("my-environment");
    environmentProd.addServiceForBackup("myfunny-db", "a1b2c3d4-1234-5678-9012-abcd8000abcd");
    environments.push(environmentProd);

    return environments;
};