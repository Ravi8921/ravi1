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
   profileImage: {
        type: String,
        required: true
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
        //  minLength: 15,
        // maxLength: 8,
    },
    address: {
        shipping: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            }
        },
        billing: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            pincode: {
                type:Number,
                required: true
            }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('myUser', userSchema)












// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({

//   fname: {

//     type: String, 
//     required: true

//     },
//   lname: {

//     type: String, 
//     required: [true,'Enter a name'],
//     trim: true

//     },
//   email: {

//     type: String, 
//     required: true, 
//     unique:true
//   },

//   profileImage: {
//       type: String, 
//     required: true
//     }, // s3 link

//   phone: {
//     type: String, 
//     required: true, 
//     unique:true 

//     }, 
//   password: {

//     type: String, 
//     required: true, 
//     // minlength: 8,
//     // maxlength: 15,
//     trim: true

//     },// encrypted password


//   address: {
//     shipping: {

//       street: {
//         type: String, 
//         required: true

//         },
//       city: {

//         type: String, 
//         required: true

//         },
//       pincode: {

//         type: String, 
//         required: true

//         }
//     },
//     billing: {
//         street: {
//         type: String, 
//         required: true
//       },
//     city: {
//         type: String, 
//         required: true
//       },

//       pincode: {
//         type: Number, 
//         required: true}
//     }
//   },
 
// });

// module.exports = mongoose.model('myUser',userSchema)