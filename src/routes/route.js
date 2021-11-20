const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const BookController= require("../controllers/bookController")
const publisherController= require("../controllers/publishercontroller")



// Authors API
router.post('/authors',  authorController.createmyAuthor  );


// Books API
router.post('/books',  BookController.createBook  );
router.get('/allbooks',  BookController.getbooks  );
// Publishers API
router.post('/createpublisher', publisherController.createmypublisher)


module.exports = router;