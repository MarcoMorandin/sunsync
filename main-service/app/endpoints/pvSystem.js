const express = require('express');
const router = express.Router();
const PvSystem = require( '../schemas/PvSystem');

router.get('/info', async (req, res) => {
    let pvSystems = await PvSystem.find({})
    res.status(200).json(pvSystems)
})

router.get('/info/id/:id', async (req, res) => {
    
})

router.get('/data', async (req, res) => {
    
})

router.get('/data/id/:id', async (req, res) => {
    
})

router.get('/data/date/start/:start/end/:end', async (req, res) => {
    
})

router.get('/data/id/:id/date/start/:start/end/:end', async (req, res) => {
    
})

router.post('', async (req, res) => {

})

router.delete('/id/:id', async (req, res) => {

})

module.exports = router;
