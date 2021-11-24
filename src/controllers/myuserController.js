const myUserModel= require("../models/myuserModel")



const createnewUser = async function (req, res) {
    
let userdata = req.body;

    var data= userdata
    let savedData= await myUserModel.create(data)
    res.send({msg: savedData})


}

const getuser = async function(req,res){
    let uid=req.params.userid

    let userdata=await myUserModel.findById({_id:uid})
    if(userdata){
        res.send({status: true,data: { userdata } })
    }else{
        res.send({status: false,msg: "plz enter valid user id"})
    }
 }

const putuser = async function(req,res){
    let uidd=req.params.userid
let upadetedemail=req.body.email
let userdata=await myUserModel.findById({_id:uidd})
if (userdata){
    let updatemail=await myUserModel.findOneAndUpdate({_id:uidd},{email:upadetedemail},{new:true})
    res.send({status: true,data:{updatemail} })
}else{
   res.send({status: false,msg: "plz enter valid user id to update your email"})
}

}
module.exports.createnewUser= createnewUser
module.exports.getuser= getuser
module.exports.putuser= putuser