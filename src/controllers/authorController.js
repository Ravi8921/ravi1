const authorModel= require("../models/authorModel.js")

const createAuthor= async function (req, res) {
    var data= req.body
    let savedData= await authorModel.create(data)
    res.send({msg: savedData})    
}


const getAuthors= async function (req, res) {
    let allAuthors= await authorModel.find()
    res.send({data: allAuthors})
}

module.exports.createAuthor= createAuthor
module.exports.getAuthors= getAuthors