const myauthorModel= require("../models/authorModel.js")

const createmyAuthor= async function (req, res) {
    var data= req.body
    let savedData= await myauthorModel.create(data)
    res.send({msg: savedData})    
}




module.exports.createmyAuthor= createmyAuthor
