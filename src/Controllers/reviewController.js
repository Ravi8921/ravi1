const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/bookModel.js")
const mongoose = require('mongoose');

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const createReview = async function (req, res) {
    try {
        let checkbookId = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (!checkbookId) {
            return res.status(404).send({ status: false, message: `book does not exists` })
        }

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
            return
        }
        const { reviewedBy, rating } = requestBody;

        if ((typeof (rating) === 'number') && (rating === 1 || rating === 2 || rating === 3 || rating === 4 || rating === 5)) {

            const reviewData = {
                bookId: req.params.bookId,
                rating,
                reviewedAt: new Date()
            }
            if (isValid(req.body.review)) {
                reviewData['review'] = req.body.review.trim();
            }
            if (isValid(reviewedBy)) {
                reviewData['reviewedBy'] = req.body.reviewedBy.trim();
            }
            await reviewModel.create(reviewData)
            const updatedBook = await bookModel.findOneAndUpdate({ _id: req.params.bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true })
            const getAllReviews = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false })

            if (!(getAllReviews)) {
                res.status(404).send({ status: false, message: "No reviews with this bookId" })
            }
            const bookWithReviews = {
                "_id": updatedBook._id,
                "title": updatedBook.title,
                "excerpt": updatedBook.excerpt,
                "userId": updatedBook.userId,
                "category": updatedBook.category,
                "subcategory": updatedBook.subcategory,
                "isDeleted": updatedBook.isDeleted,
                "reviews": updatedBook.reviews,
                "deletedAt": updatedBook.deletedAt, // if deleted is true deletedAt will have a date 2021-09-17T04:25:07.803Z,
                "releasedAt": updatedBook.releasedAt,
                "coverphoto":updatedBook.coverphoto,
                "createdAt": updatedBook.createdAt,
                "updatedAt": updatedBook.updatedAt,
                "reviwersData": getAllReviews
            }
            return res.status(200).send({ status: true, message: "successfull", data: bookWithReviews })
        }
        return res.status(400).send({ status: false, message: ' Please provide a valid rating between 1-5' })
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: 'Server Error' })
    }
}


const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide update details' })
        }

        let checkbookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkbookId) {
            return res.status(404).send({ status: false, message: `book does not exists` })
        }
        let checkreviewId = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkreviewId) {
            return res.status(404).send({ status: false, message: `review does not exists` })
        }
        if (!(checkreviewId.bookId.toString() == checkbookId._id.toString())) {
            return res.status(400).send({ status: false, message: 'Invalid bookId or reviewId' })
        }

        let updatedetails = {};
        if (isValid(req.body.review)) {
            updatedetails['review'] = req.body.review.trim();
        }

        if ((typeof (req.body.rating) === 'number') && (req.body.rating == 1 || req.body.rating == 2 || req.body.rating == 3 || req.body.rating == 4 || req.body.rating == 5)) {
            updatedetails['rating'] = req.body.rating;
        }
        if ('rating' in req.body) {
            if (req.body.rating === null || typeof (req.body.rating) === 'undefined') {
                return res.status(400).send({ status: false, message: `rating is null` })
            } else if (req.body.rating > 5 || req.body.rating < 1) {
                return res.status(400).send({ status: false, message: `Give correct rating` })
            } else if (typeof (req.body.rating) !== 'number') {
                return res.status(400).send({ status: false, message: `Give rating as number` })
            } else if (req.body.rating % 1 !== 0) {
                return res.status(400).send({ status: false, message: `Give rating as whole number` })
            }
        }

        if (isValid(req.body.reviewedBy)) {
            updatedetails['reviewedBy'] = req.body.reviewedBy.trim();
        }
        const a = await reviewModel.findOneAndUpdate({ _id: reviewId }, updatedetails, { new: true })
        let reviewDetails = await reviewModel.find({ bookId: bookId, isDeleted: false })
        if (!(reviewDetails)) {
            res.status(404).send({ status: false, message: "details not found" })
        }
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
            "reviwersData": reviewDetails
        }
        return res.status(200).send({ status: true, message: "successfull", data: bookWithReviews })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const DeleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        let checkbookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkbookId) {
            return res.status(404).send({ status: false, message: `book does not exists` })
        }
        let checkreviewId = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkreviewId) {
            return res.status(404).send({ status: false, message: `review does not exists` })
        }
        if (!(checkreviewId.bookId.toString() == checkbookId._id.toString())) {
            return res.status(400).send({ status: false, message: 'Invalid bookId or reviewId' })
        }

        let deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true })
        if (deleteReview) {
            res.status(200).send({ status: true, msg: 'Deleted successful' })
            await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } }, { new: true })
            return
        } else {
            return res.status(404).send({ status: false, msg: "Review does'nt exist" })
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.DeleteReview = DeleteReview
module.exports.updateReview = updateReview
module.exports.createReview = createReview