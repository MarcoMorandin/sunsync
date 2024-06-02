const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const User = require('../schemas/User');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');
const crypto = require('crypto');
const hat = require('hat');

require('dotenv').config();

const tokenChecker = require('../middlewares/tockenChecker');
const tokenCheckerChangePassword = require('../middlewares/tockenCheckerChangePassword');

/**
 * Endpoint that returns a list of all registered user. This endpoint is accessible
 * only if the user has role admin else it returns 401.
 */
router.get('', tokenChecker, async (req, res) => {
    if (req.user.role == 1)
        return res
            .status(401)
            .json({ '401 Unauthorized': 'You are not authorized' });

    let users = await User.find(
        {},
        '_id username mail forecast_notification maintenance_notification role disabled',
    );
    res.status(200).json(users);
});

/**
 * Endpoint that returns all informations about the user that contact this endpoint.
 * It could be returns 404 if the user cannot be found.
 */
router.get('/me', tokenCheckerChangePassword, async (req, res) => {
    let user = await User.findById(
        req.user._id,
        '_id username mail forecast_notification maintenance_notification role disabled bot_token',
    ).exec();

    if (!user) {
        res.status(404).json({
            '404 Not Found': 'No user found with the given ID',
        });
        return;
    }

    res.status(200).json(user);
});

/**
 * Endpoint that returns all informations about a user given his user_id. This endpoint is accessible
 * only if the user has role admin else it returns 401. If the user_id is not a valid MongoDb
 * ObjectId it returns 400 and in the end if the user cannot be found it returns 404.
 */
router.get(
    '/:user_id',
    tokenChecker,
    param('user_id').isMongoId(),
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

        let user = await User.findById(
            req.params.user_id,
            '_id username mail forecast_notification maintenance_notification role disabled',
        ).exec();

        if (!user) {
            res.status(404).json({
                '404 Not Found': 'No user found with the given ID',
            });
            return;
        }

        res.status(200).json(user);
    },
);

/**
 * Endpoint used to register new users. It require a username, an email, a password and a role.
 * In SunSync only the admins could register new user so if the endpoint is contacted by an employee
 * it returns 401. Moreover if any of the params are not valid it returns 400 and if there is another
 * user with the same email address already registered it gives 409. To the given password is
 * added a random salt that is a random string of 128 byte and then hashed with sha256 algorithm
 * to store them in a safe way.
 */
router.post(
    '',
    tokenChecker,
    [
        body('username', 'username must be a valid string').isAlpha(),
        body('username', 'username must be filled').notEmpty(),

        body('mail', 'mail must be a valid email').isEmail(),
        body('mail', 'mail must be filled').notEmpty(),

        body('password', 'password must be filled').notEmpty(),

        body('role', 'Invalid role').isInt({ min: 0, max: 1 }),
        body('role', 'role must be filled').notEmpty(),
    ],
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

        let users = await User.find({ mail: req.body.mail });
        if (users.length > 0)
            return res
                .status(409)
                .json({ '409 Conflict': 'The user already exists' });

        let salt = crypto.randomBytes(128).toString('hex');
        let password = createHash('sha256')
            .update(req.body.password + salt)
            .digest('hex');

        let a = await User.create({
            _id: new ObjectId(),
            username: req.body.username,
            mail: req.body.mail,
            password: password,
            forecast_notification: false,
            maintenance_notification: false,
            role: req.body.role,
            disabled: true,
            salt: salt,
            bot_token: hat(),
        });

        res.status(200)
            .json({
                info: 'Operazione completata',
                data: {
                    _id: a._id,
                    username: a.username,
                    mail: a.mail,
                    forecast_notification: a.forecast_notification,
                    maintenance_notification: a.maintenance_notification,
                    role: a.role,
                    disabled: a.disabled,
                    bot_token: a.bot_token,
                },
            })
            .send();
    },
);

/**
 * Endpoint that is used to delete a user given his user_id, it must be a valid MongoDb ObjectId
 * otherwise it returns 400. This endpoint is accessible only for user with role admin so if an
 * employee contact this endpoint it receives a 401. If no user could be found with the given
 * user_id it returns 404.
 */
router.delete(
    '/:user_id',
    tokenChecker,
    param('user_id').isMongoId(),
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
        let user = await User.countDocuments({ _id: req.params.user_id });
        if (!user || user === 0) {
            res.status(404).json({
                '404 Not Found': 'No user found with the given ID',
            });
            return;
        }
        let eliminated = await User.deleteOne({
            _id: ObjectId.createFromHexString(req.params.user_id),
        });

        res.status(200)
            .json({
                info: 'Operazione completata',
                data: {
                    _id: eliminated._id,
                    username: eliminated.username,
                    mail: eliminated.mail,
                    forecast_notification: eliminated.forecast_notification,
                    maintenance_notification:
                        eliminated.maintenance_notification,
                    role: eliminated.role,
                    disabled: eliminated.disabled,
                },
            })
            .send();
    },
);

/**
 * Endpoint used to modify the password of the current user. It requires the old_password
 * and the new password otherwise it returns 400. If the old password is incorrect or the new
 * password is equal to the old password it returns 400. If no user can be found returns a 404.
 * To the given new password is added a random salt that is a random string of 128 byte and
 * then hashed with sha256 algorithm to store them in a safe way.
 */
router.patch(
    '/me',
    tokenCheckerChangePassword,
    [
        body('old_password', 'old_password must be filled').notEmpty(),
        body('password', 'password must be filled').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let userOld = await User.findById(req.user._id).exec();
        let old_password_in = createHash('sha256')
            .update(req.body.old_password + userOld.salt)
            .digest('hex');
        let password_in = createHash('sha256')
            .update(req.body.password + userOld.salt)
            .digest('hex');

        if (old_password_in !== userOld.password) {
            return res
                .status(400)
                .json({ '400 Bad Request': 'Old password is incorrect' });
        } else if (old_password_in === password_in) {
            return res.status(400).json({
                '400 Bad Request': 'New password must be different from old',
            });
        }

        let salt = crypto.randomBytes(128).toString('hex');
        let password = createHash('sha256')
            .update(req.body.password + salt)
            .digest('hex');

        let user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { password: password, salt: salt, disabled: false },
            { includeResultMetadata: true },
        );
        if (!user.lastErrorObject.updatedExisting)
            return res
                .status(404)
                .json({ '404 Not Found': 'No user found with the given mail' });

        return res.status(200).json({ info: 'Operazione completata' }).send();
    },
);

/**
 * Endpoint used to modify the password of a user. It requires the new password otherwise it returns 400.
 * If the new password is equal to the old password it returns 400. If no user can be found returns a 404.
 * To the given new password is added a random salt that is a random string of 128 byte and
 * then hashed with sha256 algorithm to store them in a safe way.
 */
router.patch(
    '/:id',
    tokenCheckerChangePassword,
    [body('password', 'password must be filled').notEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let userId = await jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.SUPER_SECRET,
            async (err, decoded) => {
                return decoded.user_id;
            },
        );
        if (userId == req.params.id) {
            return res.status(400).json({
                '400 Bad Request': "User can't change his own password by id",
            });
        }

        let userOld = await User.findById(req.user._id).exec();
        let old_password_in = createHash('sha256')
            .update(userOld.password + userOld.salt)
            .digest('hex');
        let password_in = createHash('sha256')
            .update(req.body.password + userOld.salt)
            .digest('hex');

        if (old_password_in === password_in) {
            return res.status(400).json({
                '400 Bad Request': 'New password must be different from old',
            });
        }

        let salt = crypto.randomBytes(128).toString('hex');
        let password = createHash('sha256')
            .update(req.body.password + salt)
            .digest('hex');

        let user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { password: password, salt: salt, disabled: true },
            { includeResultMetadata: true },
        );
        if (!user.lastErrorObject.updatedExisting)
            return res
                .status(404)
                .json({ '404 Not Found': 'No user found with the given mail' });

        return res.status(200).json({ info: 'Operazione completata' }).send();
    },
);

/**
 * Endpoint that authenticate users by email and password and gives the token to a user.
 * If the email has not a correct format or any field is empty it returns 400. In the case that
 * a user insert wrong password or email or if it is not registered it gives 401.
 */
router.post(
    '/authentication',
    [
        body('mail', 'mail must be a valid email').isEmail(),
        body('mail', 'mail must be filled').notEmpty(),

        body('password', 'password must be filled').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        let user = await User.findOne({ mail: req.body.mail });
        if (!user) {
            return res.status(401).json({
                '401 Unauthorized':
                    'Authentication failed, mail or password error',
            });
        } else {
            let salt = user.salt;
            let password = createHash('sha256')
                .update(req.body.password + salt)
                .digest('hex');
            if (user.password !== password)
                return res.status(401).json({
                    '401 Unauthorized':
                        'Authentication failed, mail or password error',
                });
        }

        let token = jwt.sign(
            {
                mail: user.mail,
                username: user.username,
                user_id: user._id,
                role: user.role,
            },
            process.env.SUPER_SECRET,
            { expiresIn: 86400 },
        );

        let refreshToken = jwt.sign(
            {
                mail: user.mail,
                user_id: user._id,
            },
            process.env.REFRESH_SUPER_SECRET,
            { expiresIn: '7d' },
        );

        // Assigning refresh token in http-only cookie
        res.cookie('refresh_jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.set('Access-Control-Allow-Credentials', 'true');

        return res
            .status(200)
            .json({ info: 'Correctly authenticated', token: token })
            .send();
    },
);

/**
 * Get a new JWT access token when refresh token is given
 * Return 401 if refresh token is missing or not compliant
 */
router.post('/refresh', (req, res) => {
    if (req.cookies?.refresh_jwt) {
        let refreshToken = req.cookies.refresh_jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_SUPER_SECRET,
            async (err, decoded) => {
                if (err) {
                    console.log('a');
                    return res.status(401).json({
                        '401 Unauthorized':
                            'Authentication failed, refresh token error',
                    });
                } else {
                    let user = await User.findById(decoded.user_id).exec();

                    let token = jwt.sign(
                        {
                            mail: user.mail,
                            username: user.username,
                            user_id: user._id,
                            role: user.role,
                        },
                        process.env.SUPER_SECRET,
                        { expiresIn: 86400 },
                    );

                    return res
                        .status(200)
                        .json({
                            info: 'Correctly re-authenticated',
                            token: token,
                        })
                        .send();
                }
            },
        );
    } else {
        return res.status(401).json({
            '401 Unauthorized': 'Authentication failed, refresh token error',
        });
    }
});

module.exports = router;
