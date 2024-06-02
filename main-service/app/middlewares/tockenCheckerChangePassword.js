const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

/**
 * This middleware works the same as the other one but this one skip the check on the disabled
 * properties due to it is used in the change password.
 */
const tokenChecker = async (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            '401 Unauthorized': 'You have to authenticate to use this endpoint',
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

            req.user = user;
            next();
        },
    );
};

module.exports = tokenChecker;
