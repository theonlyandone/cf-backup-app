const assert = require('assert');

exports.validateEnvironmentVariables = () => {
    const vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    var username = vcapServices['user-provided'][0].credentials.username;
    var password = vcapServices['user-provided'][0].credentials.password;

    assert(process.env['CF_HOST_URL'], "Host URL not defined");
    assert(process.env['CF_LOGIN_URL'], "Login URL not defined");

    assert(parseInt(process.env['BACKUP_COUNT_TOTAL']) >= 0, "Backup count total not >= 0");
    assert(parseInt(process.env['BACKUP_COUNT_TOTAL']) <= 30, "Backup count total not <= 30");

    assert(parseInt(process.env['BACKUP_COUNT_HOURLY']) >= 0, "Backup count hourly not >= 0");
    assert(parseInt(process.env['BACKUP_COUNT_HOURLY']) <= 24, "Backup count hourly not <= 24");

    //assert(parseInt(process.env['BACKUP_COUNT_DAILY']) >= 0, "Backup count daily not >= 0");
    //assert(parseInt(process.env['BACKUP_COUNT_DAILY']) + parseInt(process.env['BACKUP_COUNT_HOURLY']) <= 30, "Backup count (sum daily and hourly) not in Range [0-30]");

    assert(username, "ENV variable USERNAME not set");
    assert(password, "ENV variable PASSWORD not set");
    assert(validateCronSchedule(process.env['CRON_EXPRESSION']), "Cron expression has wrong format");
}

exports.logInfo = (message) => {
    console.log(message);
}

exports.logError = (message, error, response, body) => {
    console.log(message);
    console.log(error);
    console.log("StatusCode: " + response.statusCode);
    console.log("Body: " + body);
}

function validateCronSchedule(cronJob) {
    var pattern = /^(((([\*]{1}){1})|((\*\/){0,1}(([0-9]{1}){1}|(([1-5]{1}){1}([0-9]{1}){1}){1}))) ((([\*]{1}){1})|((\*\/){0,1}(([0-9]{1}){1}|(([1]{1}){1}([0-9]{1}){1}){1}|([2]{1}){1}([0-3]{1}){1}))) ((([\*]{1}){1})|((\*\/){0,1}(([1-9]{1}){1}|(([1-2]{1}){1}([0-9]{1}){1}){1}|([3]{1}){1}([0-1]{1}){1}))) ((([\*]{1}){1})|((\*\/){0,1}(([1-9]{1}){1}|(([1-2]{1}){1}([0-9]{1}){1}){1}|([3]{1}){1}([0-1]{1}){1}))|(jan|feb|mar|apr|may|jun|jul|aug|sep|okt|nov|dec)) ((([\*]{1}){1})|((\*\/){0,1}(([0-7]{1}){1}))|(sun|mon|tue|wed|thu|fri|sat)))$/
    return pattern.test(cronJob);
}