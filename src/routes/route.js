const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
 const cartController = require('../controllers/cartController')
 const orderController = require('../controllers/orderController')

const middlewares = require('../middlewares/appMiddleware')

router.post('/register', userController.registerUser)
router.post('/login', userController.Login)
router.get('/user/:userId/profile', middlewares.auth, userController.getUserData)
router.put('/user/:userId/profile', middlewares.auth, userController.updateUser)


router.post('/createProduct', productController.createProduct)
router.get('/getAllProducts', productController.getAllProducts)
router.put('/products/:productId', productController.getProductDetails)
router.delete('/products/:productId', productController.deleteProduct)



//Cart's APIs -> Authentication required.
router.post('/users/:userId/cart', middlewares.auth, cartController.cartCreation)
router.put('/users/:userId/cart', middlewares.auth, cartController.updateCart)
router.get('/users/:userId/cart', middlewares.auth, cartController.getCart)
router.delete('/users/:userId/cart', middlewares.auth, cartController.deleteCart)

//Order's APIs -> Authentication required.
router.post('/users/:userId/orders', middlewares.auth, orderController.orderCreation)
router.put('/users/:userId/orders', middlewares.auth, orderController.updateOrder)

module.exports = router
