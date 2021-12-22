const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');

const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } //if undefined or null occur rather than what we are expecting than this particular feild will be false.
    if (value.trim().length == 0) { return false } //if user give spaces not any string eg:- "  " =>here this value is empty, only space is there so after trim if it becomes empty than false will be given. 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } //to check only string is comming and after trim value should be their than only it will be true.
}

const validString = function(value) {
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const validfortitle = function (value) {
    if (['Mr', 'Mrs', 'Miss'].indexOf(value) == -1) { return false } //mean's he have not found it
    if (['Mr', 'Mrs', 'Miss'].indexOf(value) > -1) { return true }   //mean's he have found it
}

const createuser = async function (req, res) {
    try {
        if (!isValidRequestBody(req.body)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
            return
        }

        const { title, name, phone, email, password, address } = req.body

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: ' Please provide valid title' })
        }
        if (!validfortitle(title)) {
            return res.status(400).send({ status: false, message: 'Please fill anyone of them-[Mr, Mrs, Miss,]' })
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: ' Please provide Name' })
        }

        const isphoneAlreadyUsed = await userModel.findOne({ phone });

        if (isphoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} phone is already registered` })
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email }); // {email: email} object shorthand property

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: ' Please provide password' })
        }
        if (!(password.trim().length > 7 && password.trim().length < 16)) {
            return res.status(400).send({ status: false, message: ' Please provide valid password' })
        }

        const userDetails= { title, name, phone, email, password, address }
        if(address){
            if('address.street'){
                if (!validString(address.street)) {
                    return res.status(400).send({ status: false, message: ' Please provide street' })
                }
                userDetails[address.street]=address.street
            }
            if('address.city'){
                if (!validString(address.city)) {
                    return res.status(400).send({ status: false, message: ' Please provide city' })
                }
                userDetails[address.city]=address.city
            }
            if('address.pincode'){
                if (!validString(address.pincode)) {
                    return res.status(400).send({ status: false, message: ' Please provide pincode' })
                }
                userDetails[address.pincode]=address.pincode
            }
        }
        let saveduser = await userModel.create(userDetails);
        res.status(201).send({ status: true, message: "User created successfully", data: saveduser });

} catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: 'Server Error' })
    }
}


const login = async function (req, res) {
    try {
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Please provide email and password details' })
        }
        const { email, password } = req.body
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'email is required' })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        const User = await userModel.findOne({ email:email.trim(), password:password.trim() });
        if (!User) {
            return res.status(401).send({ status: false, msg: "invalid email or password" });
        }

        let payload = {
            userId: User._id,
            iat: Math.floor(Date.now() / 1000), //	The iat (issued at) identifies the time at which the JWT was issued. [Date.now() / 1000 => means it will give time that is in seconds(for January 1, 1970)] (abhi ka time de gha jab bhi yhe hit hugha)
            exp: Math.floor(Date.now() / 1000) +  60 * 60 //The exp (expiration time) identifies the expiration time on or after which the token MUST NOT be accepted for processing.   (abhi ke time se 10 ganta tak jalee gha ) Date.now() / 1000=> seconds + 60x60min i.e 1hr and x10 gives 10hrs.
        };

        let token = jwt.sign(payload, "radium");

        res.header("x-api-key", token);

        res.status(200).send({ status: true, message: "success", data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


module.exports.createuser = createuser
module.exports.login = login