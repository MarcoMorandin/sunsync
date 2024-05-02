const express = require('express');
const router = express.Router();

const WeatherData = require("../schemas/WeatherData");

router.get('/', async (req, res) => {
    let data = await WeatherData.find({});
    res.status(200).json(data);
})

router.get('/:id', async (req, res) => {
    if(!isNaN(req.params.id)){
        let data = await WeatherData.find({ "metadata.ws_id": req.params.id });
        if(data.length === 0) {
            res.status(404).json({"404 Not Found": "No Weather Station with given params"});
        } else {
            res.status(200).json(data);
        }
    } else {
        res.status(400).json({"400 Bad Request": "Wrong id format"});
    }
})

module.exports = router;
