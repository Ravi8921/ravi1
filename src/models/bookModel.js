const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const mybookSchema= new mongoose.Schema({


    name: String,
  
    author:{
        type:ObjectId ,
        ref:'myauthor'
    },
    price: Number,
    rating:Number,
    publisher:{type:ObjectId ,
           ref:'mypublisher'}
}, {timestamps: true} )

module.exports = mongoose.model( 'mybook',mybookSchema )

