const express = require('express');
const router = express.Router();

router.get('/production', async (req, res) => {
    
    res.status(200).json({});
})

module.exports = router;
