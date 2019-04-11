const assert = require('assert');

exports.validateEnvironmentVariables = () => {
  assert(process.env['CF_HOST_URL'], "Host URL not defined");
  assert(process.env['CF_LOGIN_URL'], "Login URL not defined");
  assert(process.env['BACKUP_COUNT'] >= 0 && process.env['BACKUP_COUNT'] <= 30, "Backup count not in Range [0-30]");
  assert(process.env['USERNAME'], "ENV variable USERNAME not set");
  assert(process.env['PASSWORD'], "ENV variable PASSWORD not set");
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

 function validateCronSchedule (cronJob) {
  var pattern = /^(((([\*]{1}){1})|((\*\/){0,1}(([0-9]{1}){1}|(([1-5]{1}){1}([0-9]{1}){1}){1}))) ((([\*]{1}){1})|((\*\/){0,1}(([0-9]{1}){1}|(([1]{1}){1}([0-9]{1}){1}){1}|([2]{1}){1}([0-3]{1}){1}))) ((([\*]{1}){1})|((\*\/){0,1}(([1-9]{1}){1}|(([1-2]{1}){1}([0-9]{1}){1}){1}|([3]{1}){1}([0-1]{1}){1}))) ((([\*]{1}){1})|((\*\/){0,1}(([1-9]{1}){1}|(([1-2]{1}){1}([0-9]{1}){1}){1}|([3]{1}){1}([0-1]{1}){1}))|(jan|feb|mar|apr|may|jun|jul|aug|sep|okt|nov|dec)) ((([\*]{1}){1})|((\*\/){0,1}(([0-7]{1}){1}))|(sun|mon|tue|wed|thu|fri|sat)))$/
  return pattern.test(cronJob);
}