require("dotenv").config()
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
        const userId = decodedToken.userId

        if(req.body.userId && req.body.userId !== userId){
            throw "UserID non valable"
        } else{
            next()
        }

    } catch (error) {
        res.status(400).json({erreur: error})
    }
}