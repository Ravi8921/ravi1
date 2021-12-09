const mongoose = require('mongoose')
let ObjectId= mongoose.Schema.Types.ObjectId


const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    logoLink: {
        type: String,
        required: true,
        trim: true,
        unique: true,
     

    }, isDeleted: {
        type: Boolean,
        default: false
    },
    interests:{
        type: Object,
        
    }

    
},{ timestamps: true })

module.exports = mongoose.model('College', collegeSchema)

