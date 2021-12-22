# project-4-BooksManagement
project/booksManagement project with node.js, express.js, mongoDb
// 1. aws-s3 and aws-sdk // step1: multer will be used as usual ( from fs learnings) // step2(BEST PRACTICE): always write s3 uploadFile code spereately - in a spereate function/file... expect this function to take file as input and give url of uploaded file as output // step 3: aws-sdk install as package // step 4: setup config for aws - authentication // step5: build the function for uploading file- marked HERE in index.js

// 2. Promises

// a) You can never use await on callback..if you are awaiting a function or a task , you can be sure that the task(function)_ has a promise written iside it // b) how to write promise: wrap your entire code within " return new Promise(function (resolve, reject) { ........ }" and when error- return reject(err)... else when data, return resolve(data)

// config AWS

// step1: multer will be used as usual // step2(BEST PRACTICE): always write s3 uploadFile code spereately - in a spereate function/file... expect this function to take file as input and give url of uploaded file as output // step 3: aws-sdk install as package // step 4: setup config for aws - authentication // step5: build the function for uploading file- marked HERE

// 1. aws-s3 and aws-sdk

Multer  - Multer is a  used for uploading files. 

Cloud storage - Cloud storage is a cloud computing model that stores data on the Internet through a cloud computing provider who manages and operates data storage as a service.
 

Cloud computing - Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user. Large clouds often have functions distributed over multiple locations, each location being a data center. 
 

AWS S3 - Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services that provides object storage through a web service interface. Amazon S3 uses the same scalable storage infrastructure that Amazon.com uses to run its global e-commerce network.
 

AWS SDK - AWS SDK (software development kit) helps simplify your coding by providing JavaScript objects for AWS services. It allows developers to access AWS from JavaScript code that runs directly in the browser, and it includes access to AWS components like Amazon S3, Amazon SNS, Amazon SQS, DynamoDB, and more.
 

Promisify - It's the conversion of a function that accepts a callback into a function that returns a promise. Such transformations are often required in real-life, as many functions and libraries are callback-based. But promises are more convenient, so it makes sense to promisify them.1
 

Callbeck hell - Callback Hell, also known as Pyramid of Doom, is an anti-pattern seen in code of asynchronous programming. It is a slang term used to describe and unwieldy number of nested “if” statements or functions