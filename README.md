
<h1 align="center">AUTOMATON DAEMON<br/><div><h6><i>a daemon who manage browser automaton in server</i></h6></div></h1>

<div align="center">
    
[![npm-publish](https://github.com/aikosiadotcom/automaton-daemon/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/aikosiadotcom/automaton-daemon/actions/workflows/npm-publish.yml)
![Branches](https://raw.githubusercontent.com/aikosiadotcom/automaton-daemon/main/badges/coverage-branches.svg?raw=true)
![Functions](https://raw.githubusercontent.com/aikosiadotcom/automaton-daemon/main/badges/coverage-functions.svg?raw=true)
![Lines](https://raw.githubusercontent.com/aikosiadotcom/automaton-daemon/main/badges/coverage-lines.svg?raw=true)
![Statements](https://raw.githubusercontent.com/aikosiadotcom/automaton-daemon/main/badges/coverage-statements.svg?raw=true)
![Jest coverage](https://raw.githubusercontent.com/aikosiadotcom/automaton-daemon/main/badges/coverage-jest%20coverage.svg?raw=true)

</div>

# INTRODUCTION

PLEASE FOLLOW BELOW TUTORIAL **ONE TIME** setup daemon module. 

For this to work, you need to create a .env file at your root project with following variables:

```
AUTOMATON_DAEMON_HOST=
AUTOMATON_DAEMON_PORT=

AUTOMATON_DEV_PROTOCOL_RANGE=

AUTOMATON_PATH_KEY_PROFILE=
AUTOMATON_FILENAME_MANIFEST_PROFILE=

AUTOMATON_SUPABASE_URL=
AUTOMATON_SUPABASE_KEY=
```

## LINUX SERVER

### SETUP DAEMON

1. Fetch source code project automaton into your server

```
git clone [url_project]
```

2. Run following command on root directory:

```
npm install --verbose
```

3. Link to npm global packages directories

```
npm install . -g
```

### SETUP PM2 - KEEP ALIVE WHEN REBOOT

1. please install pm2 on your server using:

```
npm install -g pm2
```

2. To generate the startup script, simply run the following command:

```
pm2 startup
```

follow the guide based on the output, until you copy and run the script as describe by the output.

To confirm that the PM2 startup service is up and running under systemd, run the following command (replace the pm2-[user].service with the actual name of your service, check the output of the previous command):

```
systemctl status pm2-root.service
```

3. Next, you want to start your Node.js applications using PM2 as follows. If you already have them up and running, started via PM2, you can skip this step:

```
pm2 start npm --name "automaton-daemon" -- run "start"
```

4. Next, you need to register/save the current list of processes you want to manage using PM2 so that they will re-spawn at system boot (every time it is expected or an unexpected server restart), by running the following command:

```
pm2 save
```

additional, *pm2 cleardump* for unsaved

5. Finally, you need to test if the setup is working fine. Restart your system, and check if all your Node.js processes are running under PM2.

```
pm2 ls
or
pm2 status
```