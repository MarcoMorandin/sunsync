##### Morandin Marco 228160 - Soldera Marco 226651
---

## Startup
To run the project docker and docker-compose are needed. First of all you need to enter ```main-service```, ```importer``` and  ```front-end``` folders and do the same steps to install npm dependencies with:
```
npm install
```
Before running the project you have to create a .env file for each subproject following the .env.example structure.

Then in the main folder of the project run
```
docker compose up
```
to start all the services (MongoDB and data simulator with Node-RED is remote; API service, front-end and importer are local).

Services can be found at the following links:
- API Service is at http://localhost:3000
- Front-End is at http://localhost

In alternative the deployed project can be found at [this link](https://sunsync-fsq1.onrender.com).

---

## Usage

### API
The API Service can be used from localhost or remote at [this link](https://[sunsync-main-service.onrender.com](https://sunsync-main-service.onrender.com). Swagger is available at [this link](https://app.swaggerhub.com/apis/SunSync/SunSync/1.0.0) to learn the structure of our API.
There are 6 resources that can be caught:
- PvInfo: resource for employee or admin about PV Systems installed;
- PvData: resource for employee or admin about production data of the PV Systems;
- WsInfo: resource for employee or admin about Weather Stations used;
- WsData: resource for employee or admin about Weather Data of the Stations;
- User: resource for admin, login and change password to manage users;
- Reports: resource for everyone to get statistics about production on the PV Systems of the owner.

### Web-App
The web-app can be visited from localhost or at [this link](https://sunsync-fsq1.onrender.com). The home page is the public statistics page for citizens. The user can login as an employee to view more detailed performance data of the PV Systems or as an admin to have the same functionalities of the employee and to manage users, PV Systems and Weather Stations.
