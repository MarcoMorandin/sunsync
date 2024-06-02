const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { param, body, validationResult } = require('express-validator');
const tokenChecker = require('../middlewares/tockenChecker');
const WeatherData = require('../schemas/WeatherData');

const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

/**
 * GET /api/v1/wsdata
 * Recupero dati meteo con possibilità di filtraggio per data e stazione meteo
 */
router.get('', tokenChecker, async (req, res) => {
    query = {};

    // Aggiunta filtro data d'inizio...
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

    // Aggiunta filtro data di fine...
    if (req.query.enddate) {
        if (req.query.enddate.match(dateRegex))
            query['time'] = {
                ...query['time'],
                $lte: new Date(req.query.enddate + 'T23:59:59.999Z'),
            };
        else {
            res.status(400).json({ '400 Bad Request': 'Wrong params format' });
            return;
        }
    }

    // Aggiunta filtro stazione meteo...
    if (req.query.wsinfo_id) {
        query = {
            ...query,
            'metadata.ws_id': new ObjectId(req.query.wsinfo_id),
        };
    }

    let data = await WeatherData.find(query).exec();

    if (!data || data.length == 0) {
        res.status(404).json({
            '404 Not Found': 'No weather data found with the given dates',
        });
        return;
    }

    res.status(200).json(data);
});

/**
 * GET /api/v1/wsdata/{id}
 * Recupero singolo dato meteo per id
 */
router.get(
    '/:wsdata_id',
    tokenChecker,
    param('wsdata_id').isMongoId(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let data = await WeatherData.findById(req.params.wsdata_id).exec();

        if (!data || data.length == 0) {
            res.status(404).json({
                '404 Not Found': 'No pv system data found with the given ID',
            });
            return;
        }

        res.status(200).json(data);
    },
);

module.exports = router;
