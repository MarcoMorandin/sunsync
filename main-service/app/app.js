const express = require('express');
const app = express();
const cors = require('cors');
const compression = require("compression");

const pvInfo = require('./endpoints/pvInfo.js');
const pvData = require('./endpoints/pvData.js');
const wsInfo = require('./endpoints/wsInfo.js');
const wsData = require('./endpoints/wsData.js');
const user = require('./endpoints/user.js');
const reports = require('./endpoints/reports.js');
const events = require('./endpoints/events.js');

app.use(compression());

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const apiVers = 2;

// Abilitazione richieste CORS...
app.use(
    cors({
        credentials: true,
        origin: true,
    }),
);

// Parsing cookies...
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url);
    next();
});

app.use(bodyParser.json());

// Redirect to current version API...
app.use('/api/v:vers/*', (req, res, next) => {
    if (req.params.vers != apiVers) {
        res.writeHead(301, {
            Location: req.originalUrl.replace(
                /\/v[0-9]+\//g,
                '/v' + apiVers + '/',
            ),
        });
        res.end();
    } else {
        next();
    }
});

// Routing della richiesta al percorso corretto...
app.use('/api/v' + apiVers + '/pvinfo', pvInfo);
app.use('/api/v' + apiVers + '/pvdata', pvData);
app.use('/api/v' + apiVers + '/wsInfo', wsInfo);
app.use('/api/v' + apiVers + '/wsData', wsData);
app.use('/api/v' + apiVers + '/users', user);
app.use('/api/v' + apiVers + '/reports', reports);
app.use('/api/v' + apiVers + '/events', events);

app.use((req, res) => {
    res.status(404);
    res.json({ error: '404 Not Found' });
});

module.exports = app;
