const collegeModel = require('../models/CollegeModel')
const internModel = require('../models/InternModels')

const isValid = function(value) {    if(typeof value === 'undefined' || value === null) return false
if(typeof value === 'string' && value.trim().length === 0) return false
return true;}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}
//-------This function is for Intern creation -------
const internCreation = async function (req, res) {
    try {
        const requestBody = req.body;
        const{name,email,mobile,collegeName}=requestBody
       
        //let collegeName = req.query.collegeName;
        
        if(!isValidRequestBody (requestBody)) {
            res.status(400).send({status: false, msg: "Plz enter intern details" })
            return
        }
        if(!isValid(name)) {
            res.status(400).send({status: false, msg: "Plz enter Interns name" })
            return
        }
        if(!isValid(email)) {
            res.status(400).send({status: false, msg: "Plz enter Interns email" })
            return
        }
        if(!isValid(mobile)) {
            res.status(400).send({status: false, msg: "Plz enter Interns mobile no." })
            return
        }
        if(!isValid(collegeName)) {
            res.status(400).send({status: false, msg: "Plz enter collge name" })
            return
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }
        if(!(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(mobile))) {
            res.status(400).send({status: false, message: `Mobile should be a valid mobile no`})
            return
        }
        const isEmailAlreadyUsed = await internModel.findOne({email}); // {email: email} object shorthand property

        if(isEmailAlreadyUsed) {
            res.status(400).send({status: false, message: `${email} email address is already registered`})
            return
        }
        const isMobileAlreadyUsed = await internModel.findOne({mobile}); // {email: email} object shorthand property

        if(isMobileAlreadyUsed) {
            res.status(400).send({status: false, message: `${mobile} mobile no is already registered`})
            return
        }
         let validCollegeData = await collegeModel.findOne({name:collegeName,isDeleted:false});
       
        requestBody.collegeId=validCollegeData._id

            let savedData = await internModel.create(requestBody)
            res.status(201).send({status: true, data: {savedData} });
       
    }
    catch (err) {
        
        res.status(500).send({status: false, msg: err.message });
    }
}




module.exports.internCreation=internCreation
