const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema= new mongoose.Schema({


    bookName: {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: ObjectId,
        ref: 'Author'
    },
    tags: [ String ], //array of strings 
    year: {type: Number, default: 2021},
    isPublished: {
        type: Boolean, //Boolean
        default: false
    },
    prices: {
        indianPrice: String,
        europeanPrice: String,
        usaPrice: String,
        nepalPrice: String,
        japanPrice: String,
        chinesePrice: String,
        sudanPrice: String
    },
    sales: {
        type: Number,
        default : 0
    },
    completionDate: {type: Date, default: Date.now }, //new Date()  //momentjs
    summary: mongoose.Schema.Types.Mixed,

    isDeleted : {type: Boolean, default: false}

    // summary : "this is a suspense novel"
    //  summary : ["ch1: Intro to backend", "ch2: intro to mongodb", "ch3: intro to nodejs:"]
    // summary : { 
    //              chapter1: "How to get started with tech",
    //              chapter2: "lets start with basics"
    //             }

}, {timestamps: true} )

module.exports = mongoose.model( 'Book1', bookSchema ) 

