const express = require('express');
const router = express.Router();

const WeatherData = require("../schemas/WeatherData");
const WeatherStation = require("../schemas/WeatherStation");
const PvSystem = require("../schemas/PvSystem");

const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

router.get('', async (req, res) => {
    let infos = await WeatherStation.find({});
    res.status(200).json(infos);
})

router.get('/:id', async (req, res) => {
    if(!isNaN(req.params.id)){
        let infos = await WeatherStation.find({ _id: req.params.id });
        if(infos.length === 0) {
            res.status(404).json({"404 Not Found": "No Weather Station with given params"});
        } else {
            res.status(200).json(infos);
        }
    } else {
        res.status(400).json({"400 Bad Request": "Wrong id format"});
    }
})

router.post('', async (req, res) => {
    
})

router.delete('/id/:id', async (req, res) => {
    if(!isNaN(req.params.id)){
        let data = await WeatherStation.find({ _id: req.params.id });
        if(data.length === 0) {
            res.status(404).json({"404 Not Found": "No Weather Station with given params"});
        } else {
            data = await PvSystem.find({ ws_id: req.params.id });
            if(data.length === 0) {
                await WeatherStation.deleteOne({ _id: req.params.id });
                await WeatherData.deleteMany({ "metadata.ws_id": req.params.id });
                res.status(200).json({action: "200 OK"});
            } else {
                res.status(412).json({"412 Precondition Failed": "Linked to Pv System"});
            }
        }
    } else {
        res.status(400).json({"400 Bad Request": "Wrong id format"});
    }
})

module.exports = router;
