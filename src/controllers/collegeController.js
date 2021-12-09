
const collegeModel = require('../models/CollegeModel')
const internModel = require('../models/InternModels')

const isValid = function(value) {    if(typeof value === 'undefined' || value === null) return false
if(typeof value === 'string' && value.trim().length === 0) return false
return true;}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}


//-------------This function will help to create the college -----------
const createCollege = async function (req, res) {
    try {
        const requestBody = req.body;
        const{name,fullName,logoLink}=requestBody
       
        if(!isValidRequestBody (requestBody)) {
            res.status(400).send({status: false, msg: "Plz enter college details" })
            return
        }

       if(!isValid(name)) {
           res.status(400).send({status: false, msg: "Plz enter College abbreviate name" })
           return
       }
       if(!isValid(fullName)) {
        res.status(400).send({status: false, msg: "Plz enter College Fullname" })
        return
    }
    if(!isValid(logoLink)) {
        res.status(400).send({status: false, msg: "Plz enter logolink(url)" })
        return
    }
    
    if(!(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(logoLink))) {
        res.status(400).send({status: false, message: `Logolink should be a valid url`})
        return
    }

        if (requestBody) {
            let savedcollege = await collegeModel.create(requestBody)
            res.status(201).send({status: true, data: {savedcollege} })
        }
        else {
            res.status(400).send({status: false, msg: "enter valid data" })
        }
    }
    catch (err) {
        res.status(500).send({status: false, msg: err.message });
    }
}
//-------------This function will help to get the college details with interndetails -----------
const getCollege = async function (req, res) {
    try {
        let collegeName = req.query.collegeName;

        let foundCollege = await collegeModel.findOne({ name: collegeName, isDeleted: false })

        const collegeId = foundCollege._id
        const internsDetails = await internModel.find({ collegeId: collegeId, isDeleted: false }).select({ "_id": 1, "name": 1, "email": 1, "mobile": 1 })

        foundCollege.interests = internsDetails

        if (foundCollege) {
            res.status(200).send({ status: true, data: {foundCollege }});
        }
        else {
            res.status(404).send({ status: false, msg: "No documents found" });
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports.createCollege = createCollege
module.exports.getCollege = getCollege
