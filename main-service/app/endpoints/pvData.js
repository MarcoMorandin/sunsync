const express = require('express');
const router = express.Router();
const PvData = require( '../schemas/PvData');
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


router.get('', async (req, res) => {
    query = {}
    if(req.query.startdate){
        if(req.query.startdate.match(dateRegex))
            query['time'] = {...query['time'], "$gte": new Date(req.query.startdate + "T00:00:00.000Z")}
        else{
            res.status(400).json({ "400 Bad Request": "Wrong params format"})
            return;
        }
    }

    if(req.query.enddate){
        if(req.query.enddate.match(dateRegex)){
            query['time'] = {...query['time'], "$lte": new Date(req.query.enddate + "T00:00:00.000Z")}
        }else{
            res.status(400).json({ "400 Bad Request": "Wrong params format"})
            return;
        }
    }

    if(req.query.pvinfo_id){
        if(!isNaN(req.query.pvinfo_id)){
            query = { ...query, "metadata.pv_id": req.query.pvinfo_id}
        }else{
            res.status(400).json({ "400 Bad Request": "Wrong params format"})
            return;
        }
    }

    let pvData = await PvData.find(query).exec()
    
    if(!pvData || pvData.length == 0){
        res.status(404).json({ "404 Not Found": "No pv system data found with the given dates"})
        return;
    }
    
    res.status(200).json(pvData)
})

router.get('/:pvdata_id', param("pvinfo_id").isMongoId(), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }
    
    let pvData = await PvData.findById(ObjectId.createFromHexString(req.params.pvdata_id)).exec()

    if(!pvData  || pvData.length == 0){
        res.status(404).json({ "404 Not Found": "No pv system data found with the given ID"})
        return;
    }
    
    res.status(200).json(pvData)
})


module.exports = router;
