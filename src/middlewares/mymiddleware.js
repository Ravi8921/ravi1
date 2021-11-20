const mongoose=require('mongoose')

const mid= function(req,res,next){
    console.log(new Date(),req.ip,req.originalUrl)// ;console.log(req.originalUrl)
    next()
}
module.exports.mid=mid