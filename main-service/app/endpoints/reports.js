const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const PvData = require('../schemas/PvData');
const PvInfo = require('../schemas/PvSystem');

/**
 * Endpoint that gives power production filtered by year, and pvinfo_id. It could return the data 
 * aggregated by year, i.e. the result is an array of the cumulative power production per year, moreover
 * the results could be aggregated by month, i.e. returns the required data month per month and all that 
 * returns the value of all power production. The endpoint returns 400 if any of the params are in the wrong format.
 */
router.get('/production', [
    query('year', 'year must be an int').optional().isInt({ min:0, max: 4000 }),
    query('pvinfo_id', 'pvinfo_id must be a valid Mongo ObjectId').optional().isMongoId() ,
    query('aggregation', 'aggregation must be a value between year, month and day').optional().isIn(['year', 'month', 'all'])
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let matchObj = {};
    let projectObj = {
        year: { $year:  "$time" },
        power: "$power"
    };
    let groupObj = {
        _id: { year: "$year" },
        total: { $sum: "$power" }
    };

    if(req.query.year) {
        matchObj['time'] = {"$gte": new Date(req.query.year + "-01-01T00:00:00.000Z"), "$lte": new Date(req.query.year + "-12-31T23:59:59.999Z")};
    }

    if(req.query.pvinfo_id) {
        matchObj= { ...matchObj, 'metadata.pv_id': ObjectId.createFromHexString(req.params.pvinfo_id)};
        projectObj = {...projectObj, pv_id: "$metadata.pv_id" };
        groupObj['_id'] = {pv_id: "$pv_id", ...groupObj['_id']};
    }

    let data = {};
    if(req.query.aggregation) {
        if(req.query.aggregation === "month") {
            projectObj = {...projectObj, month: { $month: "$time" } };
            groupObj['_id'] = {...groupObj['_id'],  month: "$month"};
        }
        else if(req.query.aggregation === "all") {
            groupObj = {
                _id: 0,
                total: { $sum: "$power" }
            };
        }
    } else {
        projectObj = {...projectObj, month: { $month: "$time" }, day: { $dayOfMonth: "$time" } };
        groupObj['_id'] = {...groupObj['_id'], month: "$month", day: "$day", };
    }

    data = await PvData.aggregate([
        { $match: matchObj },
        { $project: projectObj },
        { $group: groupObj },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json(data);
})

/**
 * Endpoint that gives the amount of saved money with the usage of pvSystems filtered by year, and pvinfo_id. It could return the data 
 * aggregated by year, i.e. the result is an array of the cumulative saved money per year, moreover
 * the results could be aggregated by month, i.e. returns the required data month per month and 'all', that 
 * returns the value of the total saved money. The endpoint returns 400 if any of the params are in the wrong format.
 */
router.get('/money', [
    query('year', 'year must be an int').optional().isInt({ min:0, max: 4000 }),
    query('pvinfo_id', 'pvinfo_id must be a valid Mongo ObjectId').optional().isMongoId(),
    query('aggregation', 'aggregation must be a value between year, month and day').optional().isIn(['year', 'month', 'all'])
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let matchObj = {};
    let projectObj = {
        year: { $year:  "$time" },
        month: { $month: "$time" },
        day: { $dayOfMonth: "$time" },
        power: "$power",
        price: "$metadata.price",
        money: { $multiply: [ "$metadata.price", "$power" ] }
    };
    let groupObj = {
        _id: { year: "$year" },
        total: { $sum: "$money" }
    };

    if(req.query.year) {
        matchObj['time'] = {"$gte": new Date(req.query.year + "-01-01T00:00:00.000Z"), "$lte": new Date(req.query.year + "-12-31T23:59:59.999Z")};
    }

    if(req.query.pvinfo_id) {
        matchObj= { ...matchObj, 'metadata.pv_id': ObjectId.createFromHexString(req.params.pvinfo_id)};
        projectObj = {...projectObj, pv_id: "$metadata.pv_id" };
        groupObj['_id'] = {pv_id: "$pv_id", ...groupObj['_id']};
    }

    if(req.query.aggregation) {
        if(req.query.aggregation === "month") {
            groupObj['_id'] = {...groupObj['_id'],  month: "$month"};
        }
        else if(req.query.aggregation === "all") {
            groupObj = {
                _id: 0,
                total: { $sum: "$money" }
            };
        }
    } else {
        groupObj['_id'] = {...groupObj['_id'], month: "$month", day: "$day", };
    }

    let data = await PvData.aggregate([
        { $match: matchObj },
        { $project: projectObj },
        { $group: groupObj },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json(data);
})

/**
 * Endpoint that returns the number of all registered pvSystem
 */
router.get('/pvnumber', async (req, res) => {
    let data = await PvInfo.aggregate([
        { $count: "number_of_pv_systems" }
    ]);

    res.status(200).json(data[0]);
})

module.exports = router;
