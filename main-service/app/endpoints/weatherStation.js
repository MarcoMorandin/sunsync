const express = require('express');
const router = express.Router();

const WeatherData = require("../schemas/WeatherData");
const WeatherStation = require("../schemas/WeatherStation");

router.get('/info', async (req, res) => {
    let infos = await WeatherStation.find({});
    res.status(200).json(infos);
})

router.get('/info/id/:id', async (req, res) => {
    
})

router.get('/data', async (req, res) => {
    
})

router.get('/data/id/:id', async (req, res) => {
    
})

router.get('/data/date/start/:start/end/:end', async (req, res) => {
    
})

router.get('/data/id/:id/date/start/:start/end/:end', async (req, res) => {
    
})

router.post('', async (req, res) => {

})

router.delete('/id/:id', async (req, res) => {

})

module.exports = router;
