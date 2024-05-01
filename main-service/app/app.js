const express = require('express');
const app = express();
const cors = require('cors')

const pvSystem = require('./endpoint/pvSystem.js')
const weatherStation = require('./endpoint/weatherStation.js')
const user = require('./endpoint/user.js')
const citizen = require('./endpoint/citizen.js')

app.use(cors())

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


app.use('/api/v1/pv', pvSystem)
app.use('/api/v1/ws', weatherStation)
app.use('/api/v1/user', user)
app.use('/api/v1/citizen', citizen)


module.exports = app;
