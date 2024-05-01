const express = require('express');
const app = express();
const cors = require('cors')

const pvSystem = require('./endpoints/pvSystem.js')
const weatherStation = require('./endpoints/weatherStation.js')
const user = require('./endpoints/user.js')
const citizen = require('./endpoints/citizen.js')

app.use(cors())

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})


app.use('/api/v1/pv', pvSystem)
app.use('/api/v1/ws', weatherStation)
app.use('/api/v1/user', user)
app.use('/api/v1/citizen', citizen)


app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;
