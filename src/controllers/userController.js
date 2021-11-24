const UserModel= require("../models/userModel")

const createmyUser = async function (req, res) {
    
let userdata = req.body;

    var data= userdata
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})
}


module.exports.createmyUser= createmyUser