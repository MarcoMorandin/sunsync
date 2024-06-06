const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const tokenChecker = require('../middlewares/tockenChecker');

const WeatherData = require('../schemas/WeatherData');
const WeatherStation = require('../schemas/WeatherStation');
const PvSystem = require('../schemas/PvSystem');

/**
 * GET /api/v1/wsinfo
 * Recupero di tutte le stazioni meteo
 */
router.get('', tokenChecker, async (req, res) => {
    let data = await WeatherStation.find({});
    res.status(200).json(data);
});

/**
 * GET /api/v1/wsinfo/{id}
 * Recupero di una stazione meteo per id
 */
router.get(
    '/:wsinfo_id',
    tokenChecker,
    param('wsinfo_id').isMongoId(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let data = await WeatherStation.findById(req.params.wsinfo_id).exec();

        if (!data) {
            res.status(404).json({
                '404 Not Found': 'No pv system found with the given ID',
            });
            return;
        }

        res.status(200).json(data);
    },
);

/**
 * POST /api/v1/wsinfo
 * Aggiunta di una stazione meteo
 */
router.post(
    '',
    tokenChecker,
    [
        body('description', 'description must be a string').isString(),
        body('description', 'description cannot contains $')
            .not()
            .contains('$'),
        body('description', 'description must be filled').notEmpty(),

        body('url', 'url must be a valid URL').isURL(),
        body('url', 'url must be filled').notEmpty(),

        body(
            'location',
            'location must follow this structure: {lat: Number, long: Number, alt: Number}',
        ).isObject({ lat: Number, long: Number, alt: Number }),
        body('location', 'location must be filled').notEmpty(),
    ],
    async (req, res) => {
        // Verifica permessi...
        if (req.user.role == 1)
            return res
                .status(401)
                .json({ '401 Unauthorized': 'You are not authorized' });

        // Verifica validità parametri...
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        let wss = await WeatherStation.find({
            $or: [{ url: req.body.url }, { description: req.body.description }],
        });
        if (wss.length > 0)
            return res
                .status(409)
                .json({ '409 Conflict': 'The weather station already exists' });

        let data = await WeatherStation.create({
            _id: new ObjectId(),
            description: req.body.description,
            url: req.body.url,
            location: req.body.location,
        });

        res.status(200)
            .json({ info: 'Operazione completata', data: data })
            .send();
    },
);

/**
 * DELETE /api/v1/wsinfo/{id}
 * Eliminazione di una stazione meteo
 */
router.delete(
    '/:wsinfo_id',
    tokenChecker,
    param('wsinfo_id').isMongoId(),
    async (req, res) => {
        // Verifica permessi...
        if (req.user.role == 1)
            return res
                .status(401)
                .json({ '401 Unauthorized': 'You are not authorized' });

        // Verifica validità parametri...
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let weatherStationNum = await WeatherStation.countDocuments({
            _id: ObjectId.createFromHexString(req.params.wsinfo_id),
        });
        if (!weatherStationNum || weatherStationNum === 0) {
            res.status(404).json({
                '404 Not Found': 'No weather station found with the given ID',
            });
            return;
        }

        // Verifica non ci siano impianti collegati a questa stazione ed eventualmente elimina con dati annessi...
        let data = await PvSystem.find({
            ws_id: ObjectId.createFromHexString(req.params.wsinfo_id),
        });
        if (data.length !== 0) {
            res.status(412).json({
                '412 Precondition Failed': 'Linked to Pv System',
            });
            return;
        }
        let eliminated = await WeatherStation.deleteOne({
            _id: ObjectId.createFromHexString(req.params.wsinfo_id),
        });
        await WeatherData.deleteMany({
            'metadata.ws_id': ObjectId.createFromHexString(
                req.params.wsinfo_id,
            ),
        });
        res.status(200)
            .json({ info: 'Operazione completata', data: eliminated })
            .send();
    },
);

module.exports = router;
