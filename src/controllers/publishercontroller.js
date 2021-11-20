const publisherModel= require("../models/publishermodel")

const createmypublisher= async function (req, res) {
    var data= req.body
    let savedData= await publisherModel.create(data)
    res.send({msg: savedData})    
}




module.exports.createmypublisher= createmypublisher