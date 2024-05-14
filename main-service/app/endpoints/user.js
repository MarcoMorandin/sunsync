const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator')
const { ObjectId } = require('mongodb');
const User = require('../schemas/User')
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');
require("dotenv").config();

const tokenChecker = require('../middlewares/tockenChecker')
const tokenCheckerChangePassword = require('../middlewares/tockenCheckerChangePassword')

router.get('', tokenChecker, async (req, res) => {
    if(req.user.role == 1)
        return res.status(401).json({ "401 Unauthorized": "You are not authorized"})
    
    let users = await User.find({}, '_id username mail forecast_notification maintenance_notification role disabled')
    res.status(200).json(users)
})

router.get('/me', tokenChecker, async (req, res) => {
    let user = await User.findById(req.user._id, '_id username mail forecast_notification maintenance_notification role disabled').exec()
    
    if(!user){
        res.status(404).json({ "404 Not Found": "No user found with the given ID"})
        return;
    }

    res.status(200).json(user);
})

router.get('/:user_id', tokenChecker, param("user_id").isMongoId(), async (req, res) => {
    if(req.user.role == 1)
        return res.status(401).json({ "401 Unauthorized": "You are not authorized"})

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let user = await User.findById(req.params.user_id, '_id username mail forecast_notification maintenance_notification role disabled').exec()
    
    if(!user){
        res.status(404).json({ "404 Not Found": "No user found with the given ID"})
        return;
    }

    res.status(200).json(user);
})

router.post('', tokenChecker, [
    body('username', 'username must be a valid string').isAlpha(),
    body('username', 'username must be filled').notEmpty(),

    body('mail', 'mail must be a valid email').isEmail(),
    body('mail', 'mail must be filled').notEmpty(),

    body('password', 'password must be filled').notEmpty(),

    body('role', 'Invalid role').isInt({min: 0, max: 1}),
    body('role', 'role must be filled').notEmpty(),
], async (req, res) => {
    if(req.user.role == 1)
        return res.status(401).json({ "401 Unauthorized": "You are not authorized"})

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let salt = crypto.randomBytes(128).toString('hex');
    let password = createHash('sha256').update(req.body.password + salt).digest('hex');

    let a = await User.create({
        _id: new ObjectId(),
        username: req.body.username,
        mail: req.body.mail,
        password: password,
        forecast_notification: false,
        maintenance_notification: false,
        role: req.body.role,
        disabled: true,
        salt: salt
    });

    res.status(200).json({"info" : "Operazione completata", "data" : a}).send()
})

router.delete('/:user_id', tokenChecker, param("user_id").isMongoId(), async (req, res) => {
    if(req.user.role == 1)
        return res.status(401).json({ "401 Unauthorized": "You are not authorized"})

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }
    let user = await User.countDocuments({ _id: req.params.user_id })
    if (!user || user === 0){
        res.status(404).json({ "404 Not Found": "No user found with the given ID"})
        return;
    }
    let eliminated = await User.deleteOne({"_id": ObjectId.createFromHexString(req.params.user_id)})
    
    res.status(200).json({"info" : "Operazione completata", "data" : eliminated}).send()
})

router.patch('', tokenCheckerChangePassword, [
    body('password', 'password must be filled').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let salt = crypto.randomBytes(128).toString('hex');
    let password = createHash('sha256').update(req.body.password + salt).digest('hex');

    let user = await User.findOneAndUpdate({_id: req.user._id}, {password: password, salt: salt, disabled: false}, {includeResultMetadata: true}) 
    if(!user.lastErrorObject.updatedExisting)
        return res.status(404).json({ "404 Not Found": "No user found with the given mail"})

    return res.status(200).json({"info" : "Operazione completata"}).send()   
})

router.post('/authentication', [
    body('mail', 'mail must be a valid email').isEmail(),
    body('mail', 'mail must be filled').notEmpty(),

    body('password', 'password must be filled').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let user = await User.findOne({mail: req.body.mail})
    if(!user){
        return res.status(401).json({ "401 Unauthorized": "Authentication failed, mail or password error"})
    } else {
        let salt = user.salt
        let password = createHash('sha256').update(req.body.password + salt).digest('hex');
        if(user.password !== password)
            return res.status(401).json({ "401 Unauthorized": "Authentication failed, mail or password error"})
    }

    let token = jwt.sign({
        mail: user.mail,
        username: user.username,
        user_id: user._id,
        role: user.role
    }, process.env.SUPER_SECRET, {expiresIn: 86400});

    return res.status(200).json({"info" : "Correctly authenticated", "token": token}).send()   
})


module.exports = router;

