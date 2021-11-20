const mongoose=require('mongoose')

const myauthorSchema=new mongoose.Schema({
    author_name: String,
  
    age: Number,
    address: String

}, {timestamps: true} )

module.exports = mongoose.model('myauthor',myauthorSchema)
