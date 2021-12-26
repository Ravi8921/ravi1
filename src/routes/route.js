const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const userController = require('../controllers/userController')
// const productController = require('../controllers/productController')
// const cartController = require('../controllers/cartController')
// const orderController = require('../controllers/orderController')

const middlewares = require('../middlewares/appMiddleware')

router.post('/register', userController.registerUser)
router.post('/login', userController.Login)

router.get('/user/:userId/profile', middlewares.auth, userController.getUserData)
router.put('/user/:userId/profile', middlewares.auth, userController.updateUser)

module.exports = router
