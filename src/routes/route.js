const express = require('express');
const router = express.Router();

// these are controller and middelware imports.
const collegeController =require("../controllers/collegeController")
const internController =require("../controllers/internController")



//these are all the API's which we will be using for each of the problem statement.
router.post('/functionup/colleges', collegeController.createCollege ) //done
router.post('/functionup/interns',internController.internCreation ) //done
router.get('/functionup/collegeDetails',collegeController.getCollege); //done



module.exports = router;