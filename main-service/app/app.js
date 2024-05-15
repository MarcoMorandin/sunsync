const express = require('express');
const app = express();
const cors = require('cors')

const pvInfo = require('./endpoints/pvInfo.js')
const pvData = require('./endpoints/pvData.js')
const wsInfo = require('./endpoints/wsInfo.js')
const wsData = require('./endpoints/wsData.js')
const user = require('./endpoints/user.js')
const reports = require('./endpoints/reports.js')
const compression = require("compression");

const bodyParser = require('body-parser')

app.use(cors())
app.use(compression());
app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use(bodyParser.json());



app.use('/api/v1/pvinfo', pvInfo)
app.use('/api/v1/pvdata', pvData)
app.use('/api/v1/wsInfo', wsInfo)
app.use('/api/v1/wsData', wsData)
app.use('/api/v1/users', user)
app.use('/api/v1/reports', reports)


app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;
