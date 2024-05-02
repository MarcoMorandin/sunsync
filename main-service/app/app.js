const express = require('express');
const app = express();
const cors = require('cors')

const pvSystem = require('./endpoints/pvSystem.js')
const wsInfo = require('./endpoints/wsInfo.js')
const wsData = require('./endpoints/wsData.js')
const user = require('./endpoints/user.js')
const reports = require('./endpoints/reports.js')

app.use(cors())

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})


app.use('/api/v1/pv', pvSystem)
app.use('/api/v1/wsInfo', wsInfo)
app.use('/api/v1/wsData', wsData)
app.use('/api/v1/user', user)
app.use('/api/v1/reports', reports)


app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;
