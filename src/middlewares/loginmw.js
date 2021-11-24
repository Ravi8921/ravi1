const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const loginmw = function (req, res, next) {
   
    let headerdata = req.headers["x-auth-token"];
    let decoded = jwt.verify(headerdata, "radium")

    if (headerdata) {
        if (decoded) {
                next()
         } else {
             res.send({ status: false, msg: "Plz provide valid header" })
        }
         } else {
        res.send({ status: false, msg: "Plz provide header" })
    }




}
module.exports.loginmw = loginmw