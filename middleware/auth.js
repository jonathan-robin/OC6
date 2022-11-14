const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(req.body)
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token);
        const decodedToken = jwt.verify(token, `1234`)
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'
        } else {
            next()
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non-authentifiée !' })
    }
};