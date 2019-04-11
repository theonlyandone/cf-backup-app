var network = require('./network');

function Environment(name) {
    var name = name;
    var services = [];

    this.addServiceForBackup = (name, guid) => {
        services.push({
            name: name,
            guid: guid
        });
    }

    this.createBackups = () => {
        if (services.length > 0) {
            services.forEach(function (service) {
                network.createBackupForService(service);
            });
        }
    }

    this.deleteBackups = () => {
        if (services.length > 0) {
            services.forEach((service) => {
                network.deleteBackupForService(service);
            });
        }
    }

}

module.exports = Environment;