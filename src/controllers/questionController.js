const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");
const userModel = require("../models/userModel");
const validator = require("../validation/validator");

const createQuestion = async function (req, res) {
  try {
    const tokenId = req.userId;
    const data = req.body;
    const userId = req.body.askedBy

    let { description, tag, askedBy } = data;

    if (!validator.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Invalid request Please provide question details", });
    }

    if (!validator.isValidObjectId(askedBy) && !validator.isValidObjectId(tokenId)) {
      return res.status(404).send({ status: false, message: "userId or askedBy is not valid" });
    }

    const user = await userModel.findOne({ _id: askedBy }); //check for user existance

    if (!user) {
      return res.status(404).send({ status: false, message: `user not found` });
    }
    if (user.creditScore < 100) {
      return res.status(400).send({ status: false, Message: "You don't have enough credit score to post a question" })
    }
    if (!(userId.toString() == tokenId.toString())) {
      return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match`, });//authorisation
    }

    if (!validator.isValid(description)) {
      return res.status(400).send({ status: false, message: "description is required" });
    }

    if (!validator.isValid(tag)) {
      res.status(400).send({ status: false, message: "tag is required" });
      return;
    }
    data.tag = tag.split(",");
    const quesn = await questionModel.create(data);
    await userModel.findOneAndUpdate({ _id: userId }, { $inc: { creditScore: -100 } })

    return res.status(201).send({ status: true, msg: "successfully created", data: quesn });
  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


const getQuestions = async function (req, res) {
  try {
    const queryParams = req.query;

    let { sort, tag } = queryParams;

    let query = {};
    if (validator.isValid(tag)) {
      const tagArr = tag.split(',')
      query['tag'] = { $all: tagArr }
    }

    if (sort) {
      sort = sort.toLowerCase();
      if (sort == "descending") { sort = -1 }
      if (sort == "ascending") { sort = 1 }

    }
    let quesns = await questionModel.find(query).sort({ createdAt: sort });

    if (Array.isArray(quesns) && quesns.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "No question found" });
    }
    // const questionsCount = data.length
    // for (let i = 0; i < data.length; i++) {
    //   let answer = await answerModel.find({ questionId: sort[i]._id })
    //   sort[i].answers = answer
    // }
    return res.status(200).send({ status: true, message: `Successfully Question Answer Found`, data: quesns });

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const getQuestionById = async function (req, res) {
  try {
    const questionId = req.params.questionId
    if (!validator.isValidObjectId(questionId)) {
      return res.status(400).send({ status: false, message: "questionId is not a valid id" })
    }
    let Question = await questionModel.findOne({ _id: questionId, isDeleted: false })
    if (!Question) {
      return res.status(404).send({ status: false, message: "question does not exist" })
    }
    const getAnswers = await answerModel.find({ questionId })
    Question = Question.toObject()
    Question["Answers"] = getAnswers
    return res.status(200).send({ status: true, message: "Question with answers", data: Question })
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}


const updateQuestion = async function (req, res) {
  try {
    const data = req.body
    const questionId = req.params.questionId
    const tokenId = req.userId

    if (!validator.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Please provide body" });
    }
    if (!(validator.isValidObjectId(questionId))) {
      return res.status(400).send({ status: false, message: `${questionId} is not a valid id` });
    }
    const question = await questionModel.findOne({ _id: questionId, isDeleted: false })
    if (!question) {
      return res.status(404).send({ status: false, msg: "question does not exist" })
    }
    // if (!(question.askedBy == tokenId)) {

    //   return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
    // }

    let { description, tag } = data
    if (!validator.validString(description)) {
      return res.status(400).send({ status: false, message: "description is missing ! Please provide the description to update." })
    }
    if (!validator.validString(tag)) {
      return res.status(400).send({ status: false, message: "tags is missing ! Please provide the tags to update." })
    }
    if (tag) {
      tag = tag.split(",")
    }
    const updateQuestion = await questionModel.findOneAndUpdate({ _id: questionId }, { description: description, tag: tag }, { new: true })
    return res.status(200).send({ status: true, message: "Question is updated", data: updateQuestion })

  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, msg: err.message })
  }

}





const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const tokenId = req.userId
    if (!validator.isValidObjectId(questionId)) {
      return res.status(400).send({ status: false, message: `${questionId} is not a valid question id` })
    }
    if (!(validator.isValidObjectId(tokenId))) {
      return res.status(400).send({ status: false, message: "Not a valid userId or tokenId" });;
    }

    const questionFind = await questionModel.findOne({ _id: questionId })
    if (!questionFind) {
      return res.status(404).send({ status: false, message: `Question Details not found with given questionId` })
    }

    if (questionFind.isDeleted == true) {
      return res.status(404).send({ status: false, message: "This Question is already deleted" });
    }
    if (!(questionFind.askedBy.toString() == tokenId.toString())) {
      return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
    }

    const deleteQuestion = await questionModel.findOneAndUpdate({ _id: questionId }, { isDeleted: true, deletedAt: new Date() })
    return res.status(200).send({ status: true, message: `Question deleted successfully`, data: deleteQuestion })
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}


// const updateQuestion = async function (req, res) {
//   try {
//     const data = req.body
//     const UserId = req.userId;
//     const questionId = req.params.questionId

//     if (!validator.isValidRequestBody(data)) {
//       return res.status(400).send({ status: false, message: "body is empty" })
//     }

//     if (!validator.isValidObjectId(questionId) && !validator.isValidObjectId(UserId)) {
//       return res.status(404).send({ status: false, message: "userId or token is not valid" })
//     };

//     const user = await questionModel.findOne({ _id: questionId, isDeleted: false })  //check for user existance
//     if (!user) {
//       res.status(404).send({ status: false, message: `user not found` })
//       return
//     };

//     if (!(user.askedBy.toString() == tokenUserId.toString())) {  //authorisation
//       return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
//     };

//     let { tag, text } = req.body
//     const updateDetails = {};
//     if (text) {
//       if (!validator.isValid(text)) {
//         res.status(400).send({ status: false, message: `Invalid text` })
//       }
//       updateDetails["text"] = text;
//     }

//     if (validator.isValid(tag)) {
//       if (!validator.isValid(tag)) {
//         res.status(400).send({ status: false, message: `Invalid tag` })
//       }

//     }

//     await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $addToSet: { subcategory: { $each: subcategory } } }, { new: true })

//   } catch (err) {
//     return res.status(500).send({ status: false, msg: err.message })
//   }
// }


module.exports = { createQuestion, getQuestions, getQuestionById, updateQuestion ,deleteQuestion};
