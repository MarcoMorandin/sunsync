const express = require('express');
const router = express.Router();
const PvData = require('../schemas/PvData');
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const { ObjectId } = require('mongodb');
const { param, body, validationResult } = require('express-validator')
const tokenChecker = require('../middlewares/tockenChecker')

/**
 * Endpoint that returns pvData. Data could be filtered by a starting date, an ending date, by
 * pvinfo_id and by all combinations of them. It checks if data is in a correct format (YY-m-dd)
 * else it returns a 400. Moreover it checks if pvinfo_id is a valid MongoDb ObjectId else it returns
 * 400. If no data can be found it returns 404.
 */
router.get('', tokenChecker, async (req, res) => {
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
            query['time'] = {...query['time'], "$lte": new Date(req.query.enddate + "T23:59:59.999Z")}
        }else{
            res.status(400).json({ "400 Bad Request": "Wrong params format"})
            return;
        }
    }

    if(req.query.pvinfo_id){
        query = { ...query, "metadata.pv_id": ObjectId.createFromHexString(req.params.pvinfo_id)}
    }

    let pvData = await PvData.find(query).exec()
    
    if(!pvData || pvData.length == 0){
        res.status(404).json({ "404 Not Found": "No pv system data found with the given dates"})
        return;
    }
    
    res.status(200).json(pvData)
})

/**
 * Endpoint that return a specific pvData by its ObjectId, it differs from the previous one 
 * because the given id is the id of a data point and not the id of a pvSystem.
 * If the pvdata_id is not a valid MongoDb ObjectId if return 400 and if no data could be
 * found it return 404.
 */
router.get('/:pvdata_id', tokenChecker, param("pvdata_id").isMongoId(), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }
    
    let pvData = await PvData.findById(req.params.pvdata_id).exec()

    if(!pvData  || pvData.length == 0){
        res.status(404).json({ "404 Not Found": "No pv system data found with the given ID"})
        return;
    }
    
    res.status(200).json(pvData)
})


module.exports = router;
