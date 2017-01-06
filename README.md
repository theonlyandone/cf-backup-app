# Automatic backup job - NodeJs
This app is running on the App Cloud and creates and deletes backups for the DBs.

## Prerequisites
### Manuell
1. Install [NodeJS](https://nodejs.org/en/)
2. npm install

## Build
### Browser
1. To start locally run. ```$ node app.js```
2. app runs locally

**Help**

**Troubleshooting**


## Release
check if correct ENV variable are set
open terminal
cd <path/to/project>
cf login
cf push

## ENV Variables
Configurable in Swisscom Developer Portal
You have to set at least username and password new.


- **CRON_EXPRESSION**: cron expression for backup schedule, default: 0 1 * * *
- **BACKUP_COUNT**: how many backups should be stored (MAX 30), default: 28
- **USERNAME**: username swisscom app cloud developer portal
- **PASSWORD**: password swisscom app cloud developer portal
- **CF_LOGIN_URL**: "https://login.lyra-836.appcloud.swisscom.com/oauth/token"
- **CF_HOST_URL**:  "https://api.lyra-836.appcloud.swisscom.com"

## Further Doc
[Documentation](https://wiki.swisscom.com/display/FCB/

