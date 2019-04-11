# Automatic backup job - NodeJs
This app is running on the Swisscom App Cloud and creates and deletes backups for the databases in your space.

## What to do after download
1. add your specific services guid to config.js file
2. upload app to your space
3. modify environment variables in developer portal
4. restart the app in developer portal

### 1. Add your services to config.js
Open `config.js`in the src folder. Remove the sample environments and add there your own environments and services. You need one environment with one service at least.
If you click on the left pane on your bounded service in your space than the service guid is in the browser-url visible.

### 2. Upload app to your CF space with terminal
```sh
$ cd <path/to/downladed/source>
$ cf login <with your credentials>
$ cf push
```

### 3. Modify app environment variables in developer portal
You need to change USERNAME and PASSWORD at least. You can use your own credentials or a technical user to authenticate on the APIs.
The other variables are optional and set to default values.
Hint: you can preset all the ENV variables in the manifest.yml file.

#### Cloud foundry environment variables
Configurable in Swisscom Developer Portal
- **CRON_EXPRESSION**: cron expression for backup schedule, default: 0 1 * * *
- **BACKUP_COUNT**: how many backups should be stored (MAX 30), default: 28
- **USERNAME**: your own username or a technical user username
- **PASSWORD**: your own password or a technical user password
- **CF_LOGIN_URL**: "https://login.lyra-836.appcloud.swisscom.com/oauth/token"
- **CF_HOST_URL**:  "https://api.lyra-836.appcloud.swisscom.com"

### 4. Restart the app
Restart the app that the new ENV values are correctly set.

### Environment variables for Swisscom Internal AppCloud
- **CF_LOGIN_URL**: "https://api.scapp-console.swisscom.com"
- **CF_HOST_URL**:  "https://login.scapp-console.swisscom.com/oauth/token"