const express = require('express');
const router = express.Router();
const Event = require('../schemas/Event');
const { ObjectId } = require('mongodb');
const { param, validationResult } = require('express-validator');
const tokenChecker = require('../middlewares/tockenChecker');
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

router.get('', tokenChecker, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    query = {};
    if (req.query.startdate) {
        if (req.query.startdate.match(dateRegex))
            query['time'] = {
                ...query['time'],
                $gte: new Date(req.query.startdate + 'T00:00:00.000Z'),
            };
        else {
            res.status(400).json({ '400 Bad Request': 'Wrong params format' });
            return;
        }
    }

    if (req.query.enddate) {
        if (req.query.enddate.match(dateRegex)) {
            query['time'] = {
                ...query['time'],
                $lte: new Date(req.query.enddate + 'T23:59:59.999Z'),
            };
        } else {
            res.status(400).json({ '400 Bad Request': 'Wrong params format' });
            return;
        }
    }

    if (req.query.pvinfo_id) {
        query = { ...query, 'pv_info._id': new ObjectId(req.query.pvinfo_id) };
    }

    if (req.query.type) {
        if (req.query.type == 'warning' || req.query.type == 'peak') {
            query = { ...query, description: req.query.type };
        } else {
            return res
                .status(400)
                .json({ '400 Bad Request': 'Wrong params format' });
        }
    }

    let events = await Event.find(query).exec();

    if (!events || events.length == 0) {
        res.status(404).json({
            '404 Not Found': 'No events found with the given params',
        });
        return;
    }

    res.status(200).json(events);
});

module.exports = router;
