const validator = require("email-validator");
const jwt = require("jsonwebtoken")

const validateEmail = function (req, res, next) {
    try {
        if (!(Object.keys(req.body).length > 0)) {
            return res.status(400).send({ status: false, msg: "request body is empty" })
        }

        if (!req.body.email) {
            return res.status(400).send({ status: false, msg: "email is not there in the request body" })
        }
        //if value is not there or value is there with spaces
        if (!(typeof (req.body.email) === 'string' && req.body.email.trim().length > 0)) {
            return res.status(400).send({ status: false, msg: "Please provide email" })
        }

        let id = req.body.email.trim()
        let verifyemailid = validator.validate(id)
        if (verifyemailid) {
            return next();
        }
        return res.status(401).send({ status: false, msg: "You have entered an invalid email address!" })
    } catch (error) {
        console.log({ ErrorIs: error.message })
        res.status(500).send({ status: false, Errormsg: error.message })
    }
}

const validateNumber = function (req, res, next) {
    try {
        if (!(Object.keys(req.body).length > 0)) {
            return res.status(400).send({ status: false, msg: "request body is empty" })
        }
        if (!req.body.phone) {
            return res.status(400).send({ status: false, msg: "Key value pair of mobile is empty" })
        }
        if (!(typeof (req.body.phone) === 'string' && req.body.phone.trim().length > 0)) {
            return res.status(400).send({ status: false, msg: "Please provide email" })
        }
        const Mobileno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
        if (req.body.phone.match(Mobileno)) {
            return next();
        }
        return res.status(400).send({ status: false, msg: "Invalid phone number" })
    } catch (error) {
        console.log({ ErrorIs: error.message })
        res.status(500).send({ status: false, Errormsg: error.message })
    }
};

const activityToken = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) { //token nahi hai in the request body
            return res.status(403).send({ status: false, msg: "Missing authentication token in the request part" });
        }
        //if token is their in the req than it will go to next line
        let validtoken = jwt.decode(token, 'radium')
        
        if (!validtoken) { //after decode some other value is their than it will say invalid
            return res.status(403).send({ status: false, msg: "The token is invalid" })
        }
        console.log(validtoken)
        if (Date.now() >= validtoken.exp * 1000) {
            return res.status(403).send({status:false, message:"token expired"});
          }
        req.userId = validtoken.userId;       //here we have created a key value pair=> key=validtoken and value=validtoken
        next()                             //and send this key value pair in the request part
    }                                      // for the further use in the Api
    catch (error) {
        console.log({ ErrorIs: error.message })
        res.status(500).send({ status: false, Errormsg: error.message })
    }
}

module.exports.activityToken=activityToken;
module.exports.validateNumber = validateNumber
module.exports.validateEmail = validateEmail
