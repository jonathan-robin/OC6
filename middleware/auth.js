const jwt = require('jsonwebtoken'); // import for hashing password
require('dotenv').config(); // import the dotenv to access global var

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] // get the token from request
        const decodedToken = jwt.verify(token, process.env.JWTOKEN) // verify the token
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) throw 'Invalid user' // if decoded token can't be verify throw err
        else next(); // else proceed
    } catch (error) { res.status(401).json(`Unsufficient permission: ${error}`) } // throw err if we can't find token in req
    
};