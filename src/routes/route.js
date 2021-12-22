const express = require('express');
const router = express.Router();
const app = express();



const userController = require('../Controllers/userController')
const bookController = require('../Controllers/bookController')
const reviewController = require('../Controllers/reviewController')

const usermiddleware = require('../Middleware/userMiddleware')

router.post('/register', usermiddleware.validateEmail, usermiddleware.validateNumber, userController.createuser);
router.post('/login', usermiddleware.validateEmail, userController.login);

router.post('/books', usermiddleware.activityToken, bookController.createBook);

router.post('/aws',bookController.coverBook);

router.get('/books', usermiddleware.activityToken, bookController.getAllBooks);
router.get('/books/:bookId', usermiddleware.activityToken, bookController.getBook);
router.put('/books/:bookId', usermiddleware.activityToken, bookController.updateBook);
router.delete('/books/:bookId', usermiddleware.activityToken, bookController.deleteBookByID);

router.post('/books/:bookId/review', reviewController.createReview);
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview);
router.delete('/books/:bookId/review/:reviewId', reviewController.DeleteReview);
router.post('/books', usermiddleware.activityToken, bookController.createBook);
module.exports = router;


// let url= await s3.upload(file)
//  let book = await bookModel.save(bookWithUrl)
//  let author = await authorModel.findOneandupdate(....)



// s3.upload(uploadParams , function (err, data) {
//     if (err) {
//       return reject( { "error": err });
//     }
//     bookModel.save( bookDateWithUrl, function (err, data) {
    //  if (err) return err
            // authorModel.save( bookDateWithUrl, function (err, data) {
        //
// }
    // )
//   });