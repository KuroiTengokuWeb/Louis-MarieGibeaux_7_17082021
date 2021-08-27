// Importations
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            global.isAdmin = isAdmin;
            //res.send({toto:"toto"})
            next();
        }
    } catch (error) {
        // problème d'identifications
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};