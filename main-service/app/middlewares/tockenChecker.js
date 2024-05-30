const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

/**
 * This middleware check if the provided JWT token is correct. The token have to
 * be in the authorization header and must be precede by 'Bearer' otherwise it is not
 * recognized and the middleware gives 401.
 * Then the token is verified and if it is expired the middleware gives 401. Moreover
 * if the token is not valid the middleware returns 403 and if the user is disabled it
 * returns 412. A user is disabled when it is registered by the administrator and until
 * he change his password it continue to remain disabled.
 */
const tokenChecker = async (req, res, next) => {
    if (!req.headers.hasOwnProperty('authorization'))
        return res
            .status(401)
            .json({
                '401 Unauthorized':
                    'You have to authenticate to use this endpoint',
            });
    let token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res
            .status(401)
            .json({
                '401 Unauthorized':
                    'You have to authenticate to use this endpoint',
            });
    }
    let user;
    const verified = jwt.verify(
        token,
        process.env.SUPER_SECRET,
        async (err, decoded) => {
            if (err) {
                if (err.name == 'TokenExpiredError')
                    return res
                        .status(401)
                        .json({ '401 Unauthorized': 'The token is expired' });
                return res
                    .status(403)
                    .json({ '403 Forbidden': 'You are not authorized' });
            }
            user = await User.findById(decoded.user_id);
            if (user.disabled) {
                return res
                    .status(412)
                    .json({
                        '412 Precondition Failed':
                            'You have to change the password',
                    });
            }
            req.user = user;
            next();
        },
    );
};

module.exports = tokenChecker;
