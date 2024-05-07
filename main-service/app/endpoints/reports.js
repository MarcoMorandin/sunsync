const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const PvData = require('../schemas/PvData');
const PvInfo = require('../schemas/PvSystem');


router.get('/production', [
    query('year', 'year must be an int').optional().isInt({ min:0, max: 4000 }),
    query('pvinfo_id', 'pvinfo_id must be a valid Mongo ObjectId').optional().isInt({ min:0 }),
    query('aggregation', 'aggregation must be a value between year, month and day').optional().isIn(['year', 'month'])
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
        total_power: { $sum: "$power" }
    };

    if(req.query.year) {
        matchObj['time'] = {"$gte": new Date(req.query.year + "-01-01T00:00:00.000Z"), "$lte": new Date(req.query.year + "-12-31T23:59:59.999Z")};
    }

    if(req.query.pvinfo_id) {
        matchObj= { ...matchObj, 'metadata.pv_id': parseInt(req.query.pvinfo_id)};
        projectObj = {...projectObj, pv_id: "$metadata.pv_id" };
        groupObj['_id'] = {pv_id: "$pv_id", ...groupObj['_id']};
    }

    let data = {};
    if(req.query.aggregation) {
        if(req.query.aggregation === "month") {
            projectObj = {...projectObj, month: { $month: "$time" } };
            groupObj['_id'] = {...groupObj['_id'],  month: "$month"};
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

router.get('/money', [
    query('year', 'year must be an int').optional().isInt({ min:0, max: 4000 }),
    query('pvinfo_id', 'pvinfo_id must be a valid Mongo ObjectId').optional().isInt({ min:0 }),
    query('aggregation', 'aggregation must be a value between year, month and day').optional().isIn(['year', 'month'])
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
        total_money: { $sum: "$money" }
    };

    if(req.query.year) {
        matchObj['time'] = {"$gte": new Date(req.query.year + "-01-01T00:00:00.000Z"), "$lte": new Date(req.query.year + "-12-31T23:59:59.999Z")};
    }

    if(req.query.pvinfo_id) {
        matchObj= { ...matchObj, 'metadata.pv_id': parseInt(req.query.pvinfo_id)};
        projectObj = {...projectObj, pv_id: "$metadata.pv_id" };
        groupObj['_id'] = {pv_id: "$pv_id", ...groupObj['_id']};
    }

    if(req.query.aggregation) {
        if(req.query.aggregation === "month") {
            groupObj['_id'] = {...groupObj['_id'],  month: "$month"};
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

router.get('/pvnumber', async (req, res) => {
    let data = await PvInfo.aggregate([
        { $count: "number_of_pv_systems" }
    ]);

    res.status(200).json(data[0]);
})

module.exports = router;
