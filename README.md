# SunSync
##### Morandin Marco 228160 - Soldera Marco 226651
---

## Startup
The ready to use branch is "release". To run the project docker and docker-compose are needed. First of all you need to enter ```main-service```, ```importer```, ```event-service```, ```pv-status-checker``` and ```front-end``` folders and do the same steps to install npm dependencies with:
```
npm install
```
Before running the project you have to create a .env file for each subproject following the .env.example structure.

Then in the main folder of the project run (the first time adding also ```--build```)
```
docker compose up
```
to start all the services (MongoDB and data simulator with Node-RED are remote; API service, front-end, pv-status-checker, event-service and importer are local).

Useful services for the user can be found exposed at the following links:
- API Service is at http://localhost:3000
- Front-End is at http://localhost

In alternative the deployed project front-end can be found at [this link](https://sunsync-fsq1.onrender.com) and API Service at [this link](https://sunsync-backend.azurewebsites.net).

---

## Usage

### Services Description
The application is composed by 5 microsaervices:
- front-end
- API Service
- importer: has a scheduled activity to import data from URL of every weather station and pv system
- pv-status-checker: checks status of every pv system periodically and changes to "warning" or "ok"
- event-service: check for new events generated and sends them to the Telegram Bot at [this link](https://t.me/sunsync_alert_bot) that requires access with the token given to users

### API
The API Service can be used from localhost or remote at [this link](https://sunsync-backend.azurewebsites.net). Swagger is available at [this link](https://app.swaggerhub.com/apis/SunSync/SunSync/2.0.0) to learn the structure of our API.
There are 7 resources that can be caught:
- PvInfo: resource for employee or admin about PV Systems installed;
- PvData: resource for employee or admin about production data of the PV Systems;
- WsInfo: resource for employee or admin about Weather Stations used;
- WsData: resource for employee or admin about Weather Data of the Stations;
- User: resource for admin, login and change password to manage users;
- Reports: resource for everyone to get statistics about production on the PV Systems of the owner.
- Events: events generated when a pv system needs maintenance or a peak of production is predicted.

### Web-App
The web-app can be visited from localhost or at [this link](https://sunsync-fsq1.onrender.com). The home page is the public statistics page for citizens. The user can login as an employee to view more detailed performance data of the PV Systems or as an admin to have the same functionalities of the employee and to manage users, PV Systems and Weather Stations.
