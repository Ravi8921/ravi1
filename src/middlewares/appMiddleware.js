const jwt = require("jsonwebtoken")

const auth = async function (req, res, next) {
    try {

        let token = req.header('x-api-key')
        if (!token) {
            res.status(401).send({ status: false, Message: 'Mandatory authentication token is missing.' })
            return
        } 
        
        const decodedtoken = jwt.verify(token, "ravikant")
            
        if (!decodedtoken) {
            res.status(401).send({ status: false, Message: 'Invalid token.' }) 
            }

        req.userId=decodedtoken.userId
        next()
            
       
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.auth = auth