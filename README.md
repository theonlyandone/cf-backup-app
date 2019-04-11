copied for the first time from https://github.com/theonlyandone/cf-backup-app, but now modified for our usecases...

# Automatic backup job
This app is running on the Swisscom AppCloud and creates and deletes backups for the services in your space.
It triggers on default every hour a backup. From 10 hourly backups upwards only daily backups are saved for 20 days.

## What to do after download
1. add your specific services guid to config.js file
2. create a user-provided-service with credentials "username" and "password"
3. upload app to your space
4. modify environment variables
5. restart the app

### 1. Add your services to config.js
Open `config.js`in the src folder. Remove the sample environments and add there your own environments and services. You need one environment with one service at least.
If you click on the left pane on your bounded service in your space than the service guid is in the browser-url visible.

### 2. create a user-provided-service
```sh
cf cups cf-backup-creds -p '{"username":"XXXXXXXXXXX", "password":"XXXXXXXXXXX"}'
```

### 3. Upload app to your CF space with terminal
```sh
$ cd <path/to/downladed/source>
$ cf login <with your credentials>
$ cf push
```

### 4. Modify app environment variables in developer portal
The variables in the APP ENV are optional and they are preset to default values.
Hint: you can preset all the ENV variables in the manifest.yml file.

#### Cloud foundry environment variables
Configurable in Swisscom Developer Portal
- **CRON_EXPRESSION**: cron expression for hourly backup schedule, default: 0 1 * * *
- **BACKUP_COUNT**: how many backups should be stored (MAX 30), default: 30
- **CF_LOGIN_URL**: "https://login.scapp-console.swisscom.com/oauth/token"
- **CF_HOST_URL**:  "https://api.scapp-console.swisscom.com"

### 5. Restart the app
Restart the app that the new ENV values are correctly set.