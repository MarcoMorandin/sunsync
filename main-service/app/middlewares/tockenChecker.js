const jwt = require('jsonwebtoken');
const User = require( '../schemas/User')

const tokenChecker = async (req, res, next) => {
    if(!req.headers.hasOwnProperty("authorization"))
        return res.status(401).json({ "401 Unauthorized": "You have to authenticate to use this endpoint"})
    let token = req.headers.authorization.split(' ')[1];
    console.log(req.headers)
    if (!token) {
        return res.status(401).json({ "401 Unauthorized": "You have to authenticate to use this endpoint"})
    }
    let user;
    const verified = jwt.verify(token, process.env.SUPER_SECRET, async (err, decoded) => {
        if (err) {
            if(err.name == 'TokenExpiredError')
                return res.status(401).json({ "401 Unauthorized": "The token is expired"})
            return res.status(403).json({ "403 Forbidden": "You are not authorized"})
        }

        user = await User.findById(decoded.user_id)
        if (user.disabled) {
            return res.status(401).json({ "401 Unauthorized": "You have to authenticate to use this endpoint"})
        }
        req.user = user
        next()
    });
};

module.exports = tokenChecker