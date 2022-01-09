const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
 const route = require('./routes/route')
 const mongoose = require('mongoose');

 const app = express();

 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: true }))
 app.use(multer().any())

 app.use('/',route)

 mongoose.connect("mongodb+srv://monty-python:SnYUEY4giV9rekw@functionup-backend-coho.0zpfv.mongodb.net/ravikant_11db?retryWrites=true&w=majority", { useNewUrlParser: true })
 .then(() => console.log('mongodb running and connected'))
 .catch(err => console.log(err))



app.listen(process.env.PORT || 3001, function () {
 console.log('Express app running on port ' + (process.env.PORT || 3001))
});


 