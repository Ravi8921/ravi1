const productModel= require("../models/productModel")

const createmyproduct= async function (req, res) {
    var data= req.body
    let savedData= await productModel.create(data)
    res.send({msg: savedData})    
}




module.exports.createmyproduct= createmyproduct