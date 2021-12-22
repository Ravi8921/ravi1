const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const validateDate = require("validate-date");
const mongoose = require('mongoose');

const aws = require("aws-sdk");

aws.config.update({
    accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
    secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
    region: "ap-south-1" // Mumbai region
});
// this function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) { // exactly 

        // Create S3 service object
        let s3 = new aws.S3({ apiVersion: "2006-03-01" });
        var uploadParams = {
            ACL: "public-read", // this file is publically readable
            Bucket: "classroom-training-bucket", // HERE
            Key: "pk_newFolder/" + file.originalname, // HERE    "pk_newFolder/harry-potter.png" pk_newFolder/harry-potter.png
            Body: file.buffer,
        };

        // Callback - function provided as the second parameter ( most oftenly)
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            console.log(data)
            console.log(`File uploaded successfully. ${data.Location}`);
            return resolve(data.Location); //HERE 
        });
    });
};


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } //if undefined or null occur rather than what we are expecting than this particular feild will be false.
    if (value.trim().length == 0) { return false } //if user give spaces not any string eg:- "  " =>here this value is empty, only space is there so after trim if it becomes empty than false will be given. 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } //to check only string is comming and after trim value should be their than only it will be true.
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createBook = async function (req, res) {
    try {

        let files = req.files;
        if (files && files.length > 0) {
          //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
          var uploadedFileURL = await uploadFile( files[0] ); // expect this function to take file as input and give url of uploaded file as output 
          //res.status(201).send({ status: true, data: uploadedFileURL });
    
        } 
        else {
          res.status(400).send({ status: false, msg: "No file to write" });
        }


        if (!isValidRequestBody(req.body)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
            return
        }

        if (!(mongoose.Types.ObjectId.isValid(req.userId))) {
            res.status(400).send({ status: false, message: `${req.userId} is not a valid token id` })
            return
        }
        if (req.body.userId.toString() !== req.userId.toString()) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: ' Please provide title' })
        }
        if (await bookModel.findOne({ title })) {
            return res.status(400).send({ status: false, message: ' Please provide unique title' })
        }

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: ' Please provide excerpt' })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: ' Please provide userId' })
        }
        if (!(await userModel.findById(userId))) {
            return res.status(404).send({ status: false, message: ' Please provide correct userId' })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: ' Please provide title' })
        }
        if (await bookModel.findOne({ ISBN })) {
            return res.status(400).send({ status: false, message: ' Please provide unique ISBN' })
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: ' Please provide category' })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: ' Please provide subcategory' })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: ' Pleases provide releasedAt' })
        }
        const release = releasedAt.split("-");
        if (release[0].length == 4 && release[1].length == 2 && release[2].length == 2) {
            if ((validateDate(releasedAt, responseType = "boolean") == true)) {
                const bookdetail = {
                    title: title.trim(), excerpt: excerpt.trim(), userId: userId.trim(), ISBN: ISBN.trim(), category: category.trim(), subcategory: subcategory.trim(), releasedAt: releasedAt.trim(), coverphoto: uploadedFileURL 
                }
                let savedbook = await bookModel.create(bookdetail);
                return res.status(201).send({ status: true, message: 'Success', data: savedbook });
            } else {
                return res.status(400).send({ status: false, message: ' Please provide corrects releasedAt' })
            }
        } else {
            return res.status(400).send({ status: false, message: ' Please provides correct releasedAt' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: 'Server Error' })
    }
}


const getAllBooks = async function (req, res) {
    try {
        const queryParams = req.query
        if (!isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: 'Please provide book details' })
        }
        const { userId, category, subcategory } = req.query

        let query = {};
        if (isValid(userId) && mongoose.Types.ObjectId.isValid(userId)) {
            query['userId'] = userId;
        }

        if (isValid(category)) {
            query['category'] = category.trim();
        }

        if (isValid(subcategory)) {
            query['subcategory'] = subcategory.trim();
        }

        let books = await bookModel.find(query)
        if (Array.isArray(books) && books.length === 0) {   //this sitution is for when the user gives details but details does not matches with any of the blogs.
            return res.status(404).send({ status: false, message: 'No books found' })
        }

        query.isDeleted = false      //for finding only those blogs which are not deleted and they are publish.
        let allbooks = await bookModel.find(query).sort({ title: 1 }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })    //this time this sitution is for when we found that blog given details are valid now we will show only those data which are not deleted and are publish with query in it.
        return res.status(200).send({ status: true, message: 'Books list', data: allbooks })
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}

const getBook = async function (req, res) {
    try {
        const bookId = req.params.bookId.trim()
        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid bookId' })
        }

        const checkbookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkbookId) {
            return res.status(404).send({ status: false, message: 'No book found' })
        }

        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })

        const bookWithReviews = {
            "_id": checkbookId._id,
            "title": checkbookId.title,
            "excerpt": checkbookId.excerpt,
            "userId": checkbookId.userId,
            "category": checkbookId.category,
            "subcategory": checkbookId.subcategory,
            "isDeleted": checkbookId.isDeleted,
            "reviews": checkbookId.reviews,
            "deletedAt": checkbookId.deletedAt, // if deleted is true deletedAt will have a date 2021-09-17T04:25:07.803Z,
            "releasedAt": checkbookId.releasedAt,
            "coverphoto":checkbookId.coverphoto,
            "createdAt": checkbookId.createdAt,
            "updatedAt": checkbookId.updatedAt,
            "reviwersData": reviewsData
        }
        return res.status(200).send({ status: true, message: "successfull", data: bookWithReviews })

    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}

const updateBook = async function (req, res) {
    try {
        if (!isValidRequestBody(req.body)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide update details' })
            return
        }

        if (!(mongoose.Types.ObjectId.isValid(req.userId))) {
            res.status(400).send({ status: false, message: `${req.userId} is not a valid token id` })
            return
        }
        const book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (!book) {
            res.status(404).send({ status: false, message: `Book not found` })
            return
        }
        if (book.userId.toString() !== req.userId.toString()) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        const filterQuery = {};
        if (isValid(req.body.title)) {
            const checkuniqueForTitle = await bookModel.find({ title: req.body.title })
            if (!(checkuniqueForTitle.length == 0)) {
                return res.status(400).send({ status: false, message: `${req.body.title} is not unique` })
            }
            filterQuery['title'] = req.body.title.trim()
        }
        if (isValid(req.body.excerpt)) {
            filterQuery['excerpt'] = req.body.excerpt.trim()
        }
        if (isValid(req.body.ISBN)) {
            const checkuniqueForISBN = await bookModel.find({ ISBN: req.body.ISBN })
            if (!(checkuniqueForISBN.length == 0)) {
                return res.status(400).send({ status: false, message: `${req.body.ISBN} is not unique` })
            }
            filterQuery['ISBN'] = req.body.ISBN.trim()
        }
        if (isValid(req.body.releasedAt)) {
            const release = req.body.releasedAt.split("-");
            if (release[0].length == 4 && release[1].length == 2 && release[2].length == 2) {
                if ((validateDate(req.body.releasedAt, responseType = "boolean") == true)) {
                    filterQuery['releasedAt'] = req.body.releasedAt.trim()
                } else { return res.status(400).send({ status: false, message: `${req.body.releasedAt} is not a valid date` }) }
            } else { return res.status(400).send({ status: false, message: `${req.body.releasedAt} is not a valid date` }) }
        }
        const updatedBook = await bookModel.findOneAndUpdate({ _id: req.params.bookId }, filterQuery, { new: true })
        return res.status(200).send({ status: true, message: 'UpdatedBook', data: updatedBook })
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}


const deleteBookByID = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const userIdFromToken = req.userId

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
            return
        }

        if (!mongoose.Types.ObjectId.isValid(userIdFromToken)) {
            res.status(400).send({ status: false, message: `${userIdFromToken} is not a valid token id` })
            return
        }

        const Book = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!Book) {
            res.status(404).send({ status: false, message: `Book not found` })
            return
        }

        if (Book.userId.toString() !== userIdFromToken.toString()) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        res.status(200).send({ status: true, message: `Book deleted successfully` })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.createBook = createBook
module.exports.getAllBooks = getAllBooks
module.exports.getBook = getBook
module.exports.updateBook = updateBook
module.exports.deleteBookByID = deleteBookByID