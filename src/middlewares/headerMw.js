const mongoose=require('mongoose')

const mid= function(req,res,next){
    let headerdata=req.headers.isfreeapp;
   
    if(headerdata){
        next()
    }else{
        res.send("Plz check your header")
    }
   
}

const mid2=function(req,res,next){
let headerdt=req.headers.isfreeapp;
if(headerdt==true){
    req.body.amount=0 ;
    req.body.save()
    req.body.isFreeAppUser = true;
    req.body.save()

}else {

}

}
module.exports.mid=mid