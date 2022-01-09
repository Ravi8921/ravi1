const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const userController = require('../controllers/userController')
const questionController = require('../controllers/questionController')
 const answerController = require('../controllers/answerController')
// const orderController = require('../controllers/orderController')

const middlewares = require('../middlewares/appMiddleware')

router.post('/Register', userController.RegisterUser)
router.post('/login', userController.Login)
router.get('/user/:userId/profile', middlewares.auth, userController.getUserData)
router.put('/user/:userId/profile', middlewares.auth, userController.updateUser)

// question api
router.post('/createquestion', middlewares.auth, questionController.createQuestion)
router.get('/question', questionController.getQuestions);
router.get('/question/:questionId', questionController.getQuestionById);
router.put('/question/:questionId', middlewares.auth, questionController.updateQuestion);
router.delete('/questions/:questionId',middlewares.auth,questionController.deleteQuestion)

//answer api
router.post('/createanswer',middlewares.auth,answerController.createAns)
router.get('/questions/:questionId/answers/:answerId',answerController.getAnswer)
router.put('/answer/:answerId',middlewares.auth,answerController.updateAnswer)
router.delete('/answer/:answerId',middlewares.auth,answerController.deleteAnswer)

module.exports = router
