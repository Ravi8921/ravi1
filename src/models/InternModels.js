const mongoose = require('mongoose')

const internSchema = new mongoose.Schema({

    name: {
        type: String,
        required: 'name is required',
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
  
    },
    mobile: {
        type: Number,
        trim: true,
        unique: true,
        required: 'Mobile No is required',

    },

    collegeId: {
        required: 'intern college is required',
        type: mongoose.Schema.Types.ObjectId,
        
    },


    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.model('Intern', internSchema)

