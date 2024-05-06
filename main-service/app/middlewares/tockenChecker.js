const jwt = require('jsonwebtoken');
const User = require( '../schemas/User')

const tokenChecker = async (req, res, next) => {	
    let token = req.headers.authorization.split(' ')[1];
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
        return user
    });

    req.user = await verified
    
    next()
};

module.exports = tokenChecker