const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

  fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
   
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm.test(v);
            },
            message: "Please enter a valid phoneNo"
        }
    },
    password: {
        type: String,
        required: true,
         minLength: [8],
        // maxLength: 8,
    },
   
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema)












