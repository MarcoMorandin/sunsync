const express = require('express');
const router = express.Router();
const PvSystem = require('../schemas/PvSystem');
const PvData = require('../schemas/PvData');
const { param, body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const tokenChecker = require('../middlewares/tockenChecker');

/**
 * Endpoint that returns infos of all pvSystem
 */
router.get('', tokenChecker, async (req, res) => {
    let pvSystems = await PvSystem.find({});
    res.status(200).json(pvSystems);
});

/**
 * Endpoint that return infos of a pvSystem with id pvinfo_id, that must
 * be a valid mongodb ObjectId. It can return 400 if the pvinfo_id is not a
 * valid ObjectId or 404 if there is not any pvSystem with the given pvinfo_id.
 */
router.get(
    '/:pvinfo_id',
    tokenChecker,
    param('pvinfo_id').isMongoId(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let pvSystem = await PvSystem.findById(req.params.pvinfo_id).exec();

        if (!pvSystem) {
            res.status(404).json({
                '404 Not Found': 'No pv system found with the given ID',
            });
            return;
        }

        res.status(200).json(pvSystem);
    },
);

/**
 * Endpoint that is used to create a new pvSystem, it checks all the given params to be valid
 * and return 401 if the token of the user has role employee because it is a feature available
 * only for admins. Moreover, it can return 400 if any of the params is not validated,
 * 409 if the given url and description are equal to another registerd pvSystem.
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

        body('ws_id', 'ws_id must be a valid Mongo ObjectId').isMongoId(),
        body('ws_id', 'ws_id must be filled').notEmpty(),

        body(
            'installed_power',
            'installed_power must be an int between 0 and 1000000',
        ).isInt({ min: 0, max: 1000000 }),
        body('installed_power', 'installed_power must be filled').notEmpty(),

        body(
            'location',
            'location must follow this structure: {lat: Number, long: Number, alt: Number}',
        ).isObject({ lat: Number, long: Number, alt: Number }),
        body('location', 'location must be filled').notEmpty(),
    ],
    async (req, res) => {
        if (req.user.role == 1)
            return res
                .status(401)
                .json({ '401 Unauthorized': 'You are not authorized' });

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        let pvs = await PvSystem.find({
            $or: [{ url: req.body.url }, { description: req.body.description }],
        });
        if (pvs.length > 0)
            return res
                .status(409)
                .json({ '409 Conflict': 'The pv system already exists' });

        let a = await PvSystem.create({
            _id: new ObjectId(),
            description: req.body.description,
            url: req.body.url,
            ws_id: ObjectId.createFromHexString(req.body.ws_id),
            installed_power: req.body.installed_power,
            location: req.body.location,
            status: 'ok',
        });

        res.status(200).json({ info: 'Operazione completata', data: a }).send();
    },
);

/**
 * Endpoint that is used to delete a specific pvSystem, it deletes all infos and data linked to
 * a pvSystem. It return 401 in case of unauthorized access by a user with a token with role
 * employee, then it could return 400 if the given pvinfo_id is not a valid MongoDb ObjectId,
 * moreover it could return 404 if the pvSystem could not be found.
 */
router.delete(
    '/:pvinfo_id',
    tokenChecker,
    param('pvinfo_id').isMongoId(),
    async (req, res) => {
        if (req.user.role == 1)
            return res
                .status(401)
                .json({ '401 Unauthorized': 'You are not authorized' });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let pvSystemNum = await PvSystem.countDocuments({
            _id: ObjectId.createFromHexString(req.params.pvinfo_id),
        });
        if (!pvSystemNum || pvSystemNum === 0) {
            res.status(404).json({
                '404 Not Found': 'No pv system found with the given ID',
            });
            return;
        }
        await PvData.deleteMany({
            'metadata.pv_id': ObjectId.createFromHexString(
                req.params.pvinfo_id,
            ),
        });
        let eliminated = await PvSystem.deleteOne({
            _id: ObjectId.createFromHexString(req.params.pvinfo_id),
        });

        res.status(200)
            .json({ info: 'Operazione completata', data: eliminated })
            .send();
    },
);

module.exports = router;
