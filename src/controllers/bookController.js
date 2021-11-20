const bookModel = require("../models/bookModel.js");
const mongoose = require("mongoose");

const createBook = async function (req, res) {
  const book = req.body;
  let savedBook = await bookModel.create(book);
  res.send({ msg: savedBook });
};

const getBooks = async function (req, res) {
  let allBooks = await bookModel.find().populate('author');
  res.send({ msg: allBooks });
};

const getBook = async function (req, res) {
  let book = await bookModel.findOne (  {sales: {$gt: 5000000} });
//   if (book.length != 0 ) {
    if (book ) { // any value present (except falsey) gets evaluated as true... null, 0  automatically defaults to false
      console.log("HI I FOUND A BOOK")
  }
  else console.log("NO BOOK FOUND")
  res.send( book );
};


module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBook = getBook;

