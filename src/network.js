var request = require("request");
var helpers = require("./helpers");

var accessToken = "";

exports.createBackupForService = (service) => {
    var options = getOptions("POST", "/custom/service_instances/" + service.guid + "/backups");

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            helpers.logInfo("Created backup for service: " + service.name);
        }
        else {
            helpers.logError("Error creating backup for service: " + service.name, error, response, body);
        }
    });
};

exports.deleteBackupForService = (service) => {
    var options = getOptions("GET", "/custom/service_instances/" + service.guid + "/backups");
    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            helpers.logInfo("Get backups for service: " + service.name);
            try {
                var backups = JSON.parse(body).resources;
                deleteBackups(backups);
            } catch (err) {
                helpers.logError("Cannot parse response body.", err);
            }
        }
        else {
            helpers.logError("Error getting backups for service: " + service.name, error, response, body);
        }
    });
};

exports.getValidToken = (success) => {
    helpers.logInfo("Start get valid token");
    var options = getOptionsForToken();

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            try {
                accessToken = JSON.parse(body).access_token;
                success();
            } catch (err) {
                helpers.logError("Cannot parse response body.", err);
            }
        }
        else {
            helpers.logError("Cannot get valid token", error, response, body);
        }
    });
};

function getOptions(method, path) {
    var url = process.env.CF_HOST_URL + path;
    var options = {
        method: method,
        url: url,
        headers: {
            "cache-control": "no-cache",
            authorization: "Bearer " + accessToken,
            accept: "application/json",
            "content-type": "application/json"
        }
    };

    return options;
}

function getOptionsForToken() {
    const vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    var username = vcapServices['user-provided'][0].credentials.username;
    var password = vcapServices['user-provided'][0].credentials.password;

    var url = process.env.CF_LOGIN_URL;

    var options = {
        method: 'POST',
        url: url,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "authorization": "Basic Y2Y6"
        },
        form: {
            grant_type: "password",
            username: username,
            password: password
        }
    };

    return options;
}

function deleteBackups(backups) {
    backups.sort((bOne, bTwo) => {
        return new Date(bOne.metadata.created_at) - new Date(bTwo.metadata.created_at);
    });
    //helpers.logInfo("sorted backups");
    //helpers.logInfo(backups);

    var todaysBackups = backups.filter(checkIsToday);
    var yesterdaysBackups = backups.filter(checkIsYesterday);

    //helpers.logInfo("today backups");
    //helpers.logInfo(todaysBackups);

    //helpers.logInfo("yesterday backups");
    //helpers.logInfo(yesterdaysBackups);

    helpers.logInfo("todaysBackups.length: " + todaysBackups.length);
    while (todaysBackups.length >= process.env.BACKUP_COUNT_HOURLY) {
        var backup = todaysBackups.shift();
        helpers.logInfo("guid: " + backup.metadata.guid + " created at: " + backup.metadata.created_at);
        deleteBackup(backup);
    }

    helpers.logInfo("todaysBackups.length: " + todaysBackups.length);
    helpers.logInfo("yesterdaysBackups.length: " + yesterdaysBackups.length);
    while (todaysBackups.length + yesterdaysBackups.length > process.env.BACKUP_COUNT_HOURLY) {
        var backup = yesterdaysBackups.shift();
        helpers.logInfo("guid: " + backup.metadata.guid + " created at: " + backup.metadata.created_at);
        deleteBackup(backup);
    }

    helpers.logInfo("backups.length: " + backups.length);
    while (backups.length >= process.env.BACKUP_COUNT_TOTAL) {
        var backup = backups.shift();
        helpers.logInfo("guid: " + backup.metadata.guid + " created at: " + backup.metadata.created_at);
        deleteBackup(backup);
    }
}

/*function deleteDailyBackups(backups) {
    backups.sort((bOne, bTwo) => {
        return new Date(bOne.metadata.created_at) - new Date(bTwo.metadata.created_at);
});

    backups.filter(checkIsDaily);

    while (backups.length >= process.env.BACKUP_COUNT_DAILY) {
        var backup = backups[0];
        helpers.logInfo("guid: " + backup.metadata.guid + " created at: " + backup.metadata.created_at);
        deleteBackup(backup);
        backups.shift();
    }
}

function deleteHourlyBackups(backups) {
    backups.sort((bOne, bTwo) => {
      return new Date(bOne.metadata.created_at) - new Date(bTwo.metadata.created_at);
    });

    backups.filter(checkIsHourly);

    while (backups.length >= process.env.BACKUP_COUNT_HOURLY) {
        var backup = backups[0];
        helpers.logInfo("guid: " + backup.metadata.guid + " created at: " + backup.metadata.created_at);
        deleteBackup(backup);
        backups.shift();
    }
}*/

function deleteBackup(backup) {
    var backupGUID = backup.metadata.guid;
    var serviceGUID = backup.entity.service_instance_id;

    var options = getOptions("DELETE", "/custom/service_instances/" + serviceGUID + "/backups/" + backupGUID);

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 204) {
            helpers.logInfo("Deleted backup successfully: " + backupGUID);
        }
        else {
            helpers.logError("Error deleting backup with id: " + backupGUID, error, response, body);
        }
    });
}

/*function checkIsDaily(backup) {
    return !checkIsHourly(backup);
}

function checkIsHourly(backup) {
    var d = new Date();
    return new Date(backup.metadata.created_at) >= d.removeHours(24);
}*/

function checkIsToday(backup) {
    var today = new Date();
    var createDate = new Date(backup.metadata.created_at);
    var isToday = createDate.getDate() == today.getDate() &&
        createDate.getMonth() == today.getMonth() &&
        createDate.getFullYear() == today.getFullYear();
    //helpers.logInfo("isToday: " + isToday);
    return isToday;
}

function checkIsYesterday(backup) {
    var today = new Date();
    var yesterday = today.removeHours(24);
    var createDate = new Date(backup.metadata.created_at);
    //helpers.logInfo("yesterday: " + yesterday);
    //helpers.logInfo("createDate: " + createDate);
    var isYesterday = createDate.getDate() == yesterday.getDate() &&
        createDate.getMonth() == yesterday.getMonth() &&
        createDate.getFullYear() == yesterday.getFullYear();
    //helpers.logInfo("isYesterday: " + isYesterday);
    return isYesterday;
}

Date.prototype.removeHours = function (h) {
    this.setTime(this.getTime() - (h * 60 * 60 * 1000));
    return this;
};
