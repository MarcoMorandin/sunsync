const express = require('express')
const router = express.Router()
const PvSystem = require( '../schemas/PvSystem')
const PvData = require( '../schemas/PvData')
const { body, validationResult } = require('express-validator')

router.get('', async (req, res) => {
    let pvSystems = await PvSystem.find({})
    res.status(200).json(pvSystems)
})

router.get('/:pvinfo_id', async (req, res) => {
    if(!isNaN(req.params.pvinfo_id)){
        res.status(400).json({ "400 Bad Request": "Wrong id format"})
        return;
    }

    let pvSystem = await PvSystem.findById(req.params.pvinfo_id).exec()
    
    if(!pvSystem){
        res.status(404).json({ "404 Not Found": "No pv system found with the given ID"})
        return;
    }
    
    res.status(200).json(pvSystem)
})

router.post('', [
    body('description', 'description must be a string').isString(),
    body('description', 'description cannot contains $').not().contains('$'),
    body('description', 'Description must be filled').notEmpty(),

    body('url', 'url must be a valid URL').isURL(),
    body('url', 'url must be filled').notEmpty(),

    body('ws_id', 'ws_id must be a valid Mongo ObjectId').isMongoId(),
    body('ws_id', 'ws_id must be filled').notEmpty(),

    body('installed_power', 'installed_power must be an int between 0 and 1000000').isInt({ min:0, max: 1000000}),
    body('installed_power', 'installed_power must be filled').notEmpty(),

    body('location', 'location must follow this structure: {lat: Number, long: Number, alt: Number}').isObject({lat: Number, long: Number, alt: Number}),
    body('location', 'location must be filled').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let a = await PvSystem.create({
        _id: new ObjectId(),
        description: req.body.description,
        url: req.body.url,
        ws_id: req.body.ws_id,
        installed_power: req.body.installed_power,
        location: req.body.location
    });

    res.status(200).json({"info" : "Operazione completata", "data" : a}).send()
})

router.delete('/id/:id', async (req, res) => {

})

module.exports = router;
