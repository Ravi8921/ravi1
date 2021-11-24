const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({

    name:{type:String,unique:true,required:true},
   
    password: {type:String,required:true},
   
}
    , { timestamps: true })

module.exports = mongoose.model('login', loginSchema)