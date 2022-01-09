const questionModel = require("../models/questionModel")
const userModel = require("../models/userModel")
const answerModel = require("../models/answerModel")
const validator = require("../validation/validator");

const createAns = async function (req, res) {

    try {
        const userId = req.body.answeredBy
        const questionId = req.body.questionId
        const tokenId = req.userId
        const requestBody = req.body

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful Answer create for Particular Question" });
        }
        if (!validator.isValidObjectId(userId) || !validator.isValidObjectId(tokenId) || !validator.isValidObjectId(questionId)) 
        {
            return res.status(404).send({ status: false, message: "answeredBy or userId or questionId is not valid" })
        };
      
        if (!(userId == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        const user = await userModel.findById(userId)
        if (!user) {
            res.status(404).send({ status: false, msg: "AnswerBy User Id not found in DB" })
        }
        const questiondetail = await questionModel.findOne({ _id: questionId, isDeleted: false })
        if (!questiondetail) {
            return res.status(400).send({ status: false, message: "question don't exist or it's deleted" })
        }
        let { text } = requestBody
        if (!validator.isValid(text)) {
            return res.status(400).send({ status: false, message: "Please provide text detail to create answer " });
        }
        let userScoredata = await questionModel.findOne({ _id: questionId })
        if (!(req.body.answeredBy == userScoredata.askedBy)) {
            let increaseScore = await userModel.findOneAndUpdate({ _id: userId }, { $inc: { creditScore: + 200 } })
            
            const data = { answeredBy:userId , text, questionId }
           
            const answerData = await answerModel.create(data);
            let totalData = { answerData, increaseScore }
            return res.status(200).send({ status: false, message: "User Credit Score updated ", data: totalData });

        } else {
            
            return res.status(400).send({ status: true, message: 'Sorry , You cannot Answer Your Own Question' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }
}



const getAnswer =  async function (req, res) {
    try{
    let questionId = req.params.questionId;
    let answerId = req.params.answerId;

    if (!validator.isValidObjectId(questionId)) {
        return res.status(400).send({ status: false, message: `${questionId} is not a valid question id` })
    }
        const QuestionFound = await questionModel.findOne({ _id: questionId, isDeleted: false })
    if (!QuestionFound) {
        return res.status(404).send({ status: false, message: `Question Details not found with given questionId` })
    }
    

    if (!validator.isValidObjectId(answerId)) {
        return res.status(400).send({ status: false, message: `${answerId} is not a valid answer id` })
    }
     const AnswerFound = await answerModel.find({ questionId: questionId ,isDeleted: false})
    if (!AnswerFound) {
        return res.status(404).send({ status: false, message: `Question Details not found with given questionId` })
    }
   
    return res.status(200).send({ status: false, Detils: AnswerFound })
} catch (err) {
    return res.status(500).send({ status: false, message: err.message })
}}


const updateAnswer = async function (req, res) {

    try {
        const answerId = req.params.answerId
        requestbody = req.body;
        const TokenDetail = req.userId

        if (!validator.isValidRequestBody(requestbody)) {
            res.status(400).send({ status: false, message: 'Request Body is missing' });
            return
        }

        if (!validator.isValidObjectId(answerId)) {
            return res.status(400).send({ status: false, message: `${answerId} is not a valid answer id` })
        }

        const AnswerFound = await answerModel.findOne({ _id: answerId, isDeleted: false })
        if (!AnswerFound) {
            return res.status(404).send({ status: false, message: `Question Details not found with given questionId` })
        }
        if (AnswerFound.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Answer no longer exists" })
        }

        if (!(TokenDetail == AnswerFound.answeredBy)) {
            return res.status(400).send({ status: false, message: "You are trying to update other user answer" })
        }
        const {  text } = requestbody;
        if (!validator.isValid(text)) {
            return res.status(400).send({ status: false, message: "Please provide valid text" })
        }
        let data = { text: text, UpdatedAt: new Date() }
        let update = await answerModel.findOneAndUpdate({ _id: answerId }, data, { new: true })
        return res.status(200).send({ status: true, message: 'Updated Successfully', data: update })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
const deleteAnswer = async function (req, res) {

    try {
        let requestbody = req.body;
        let TokenDetail = req.user;
        if (!validator.isValidRequestBody(requestbody)) {
            res.status(400).send({ status: false, message: 'Please provide userId and questionId' });
            return
        }
        let { userId, questionId } = requestbody
        if (!validator.isValidObjectId(userId) && !validator.isValidObjectId(questionId)) 
        {
            return res.status(404).send({ status: false, message: "userid or questionId is not valid" })
        };
        if (!(TokenDetail == userId)) {
            return res.status(400).send({ status: false, message: "You are trying to delete other user answer" })
        }
        const deleteAnswer = await answerModel.findOneAndUpdate({ answeredBy: userId, questionId: questionId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        return res.status(200).send({ status: true, message: `Answer deleted successfully`, data: deleteAnswer })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createAns, getAnswer, updateAnswer, deleteAnswer }



















