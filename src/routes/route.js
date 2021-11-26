const express = require('express');
const router = express.Router();

const cowinController= require("../controllers/cowinController")

router.get("/cowin/states", cowinController.getStatesList)
router.get("/cowin/districts/:stateId", cowinController.getDistrictsList)
router.get("/cowin/centers", cowinController.getByPin)
router.post("/cowin/getOtp", cowinController.getOtp)
router.get("/london/weather", cowinController.london)
router.get("/city/temp", cowinController.londonTemp)
router.get("/citytemp/temp", cowinController.Temp)
module.exports = router;