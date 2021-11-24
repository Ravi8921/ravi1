const express = require('express');
const router = express.Router();
const user=require('../controllers/userController')
const product=require('../controllers/productController')
const order=require('../controllers/orderConlroller')
const middleware=require('../middlewares/headerMw')
const myuser=require('../controllers/myuserController')
const login =require('../controllers/loginController')
const loginmw=require('../middlewares/loginmw')

// user API
router.post('/createuser', middleware.mid, user.createmyUser );

//product API
router.post('/createproduct',  product.createmyproduct );
// order API
router.post('/createorder', middleware.mid, order.createmyorder );
//23/11/21
router.post('/createnewuser',  myuser.createnewUser );
router.post('/createlogin',login.createnewlogin)
router.get('/users/:userid',loginmw.loginmw,myuser.getuser)
router.put('/users/:userid',loginmw.loginmw,myuser.putuser)
module.exports = router;