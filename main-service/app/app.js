const express = require('express');
const app = express();
const cors = require('cors')

const pvInfo = require('./endpoints/pvInfo.js')
const pvData = require('./endpoints/pvData.js')
const wsInfo = require('./endpoints/wsInfo.js')
const wsData = require('./endpoints/wsData.js')
const user = require('./endpoints/user.js')
const reports = require('./endpoints/reports.js')
const tokenChecker = require('./middlewares/tockenChecker.js')

const bodyParser = require('body-parser')

// Abilitazione richieste CORS...
app.use(cors())

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use(bodyParser.json());


// Routing della richiesta al percorso corretto...
app.use('/api/v2/pvinfo', pvInfo)
app.use('/api/v2/pvdata', pvData)
app.use('/api/v2/wsInfo', wsInfo)
app.use('/api/v2/wsData', wsData)
app.use('/api/v2/users', user)
app.use('/api/v2/reports', reports)


app.use((req, res) => {
    res.status(404);
    res.json({ error: '404 Not Found' });
});


module.exports = app;
