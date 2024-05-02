const express = require('express');
const app = express();
const cors = require('cors')

const pvInfo = require('./endpoints/pvInfo.js')
const pvData = require('./endpoints/pvData.js')

const weatherStation = require('./endpoints/weatherStation.js')
const user = require('./endpoints/user.js')
const citizen = require('./endpoints/citizen.js')
const bodyParser = require('body-parser')

app.use(cors())

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use(bodyParser.json());


app.use('/api/v1/pvinfo', pvInfo)
app.use('/api/v1/pvdata', pvData)

app.use('/api/v1/ws', weatherStation)
app.use('/api/v1/user', user)
app.use('/api/v1/citizen', citizen)


app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;
