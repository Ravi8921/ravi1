const mybookModel = require("../models/bookModel.js");
const myauthorModel = require("../models/authorModel");
const publisherModel = require("../models/publishermodel");
const mongoose = require("mongoose");

const createBook = async function (req, res) {
  let book = req.body;
  let authorId = req.body.author
  let publisherId = req.body.publisher

  let authorFromRequest = await myauthorModel.findById(authorId)
  let publisherFromRequest = await publisherModel.findById(publisherId)

  if (authorFromRequest) {
    if(publisherFromRequest){
      let bookCollection = await mybookModel.create(book);
      res.send({book:bookCollection});
    }else{
      res.send('The publisher ID provided is not valid')
    }
    
  } else {
    res.send('The author ID provided is not valid')
  }
};


const getbooks =async function(req,res){
   let booklist = await mybookModel.find().populate({path:"author",select:{"author_name":1,"age":1}}).populate('publisher')
res.send({data:booklist})
}

 


module.exports.createBook = createBook;
module.exports.getbooks = getbooks;


