const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator')
const { ObjectId } = require('mongodb');
const User = require('../schemas/User')

router.get('', async (req, res) => {
    let users = await User.find({})
    res.status(200).json(users)
})

router.get('/:user_id', param("user_id").isMongoId(), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let user = await User.findById(req.params.user_id).exec()
    
    if(!user){
        res.status(404).json({ "404 Not Found": "No user found with the given ID"})
        return;
    }
    
    res.status(200).json(user)
})

router.post('', [
    body('username', 'username must be a valid email').isEmail(),
    body('username', 'username must be filled').notEmpty(),

    body('password', 'password must be filled').notEmpty(),

    body('role', 'Invalid role').isInt({min: 0, max: 1}),
    body('role', 'role must be filled').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // TODO : Implement password hashing
    let a = await User.create({
        _id: new ObjectId(),
        username: req.body.username,
        password: req.body.password,
        forecast_notification: false,
        maintenance_notification: false,
        role: req.body.role,
        disabled: true
    });

    res.status(200).json({"info" : "Operazione completata", "data" : a}).send()
})

router.delete('/:user_id', param("user_id").isMongoId(), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }
    let user = await User.countDocuments({ _id: req.params.user_id })
    if (!user || user === 0){
        res.status(404).json({ "404 Not Found": "No pv system found with the given ID"})
        return;
    }
    let eliminated = await User.deleteOne({"_id": ObjectId.createFromHexString(req.params.user_id)})
    
    res.status(200).json({"info" : "Operazione completata", "data" : eliminated}).send()
})

module.exports = router;
