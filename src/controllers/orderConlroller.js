const orderModel= require("../models/orderModel")
const userModel= require("../models/userModel")
const productModel= require("../models/productModel")



const createmyorder = async function (req, res) {
    
let orderdata = req.body;
let uid = req.body.userId;
let pid = req.body.productId;
let validateuid = await userModel.findById(uid);
let validatepid = await productModel.findById(pid);
let isfreeapp = req.headers.isfreeapp


if(validateuid && validatepid){
    var data= orderdata
    let savedData= await orderModel.create(data)
    res.send({msg: savedData})
}else{

    res.send({msg:"plz enter valid user id & product id"})

}




}
module.exports.createmyorder= createmyorder