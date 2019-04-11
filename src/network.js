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
}

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
}


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
}


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
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    }
  };

  return options;
}


function deleteBackups(backups) {
  backups.sort( (bOne, bTwo) => {
    return new Date(bOne.metadata.created_at) - new Date(bTwo.metadata.created_at);
  });

  while ( backups.length > process.env.BACKUP_COUNT ) {
    var backup = backups[0];
    helpers.logInfo("guid: " + backup.metadata.guid + " created at: " + backup.metadata.created_at);
    deleteBackup(backup);
    backups.shift();
  }
}


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
