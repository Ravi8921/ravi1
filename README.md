# Radium


##Open to Intern Project Requirement
Key points
Create a group database groupXDatabase. You can clean the db you previously used and resue that.
This time each group should have a single git branch. Coordinate amongst yourselves by ensuring every next person pulls the code last pushed by a team mate. You branch will be checked as part of the demo. Branch name should follow the naming convention project/internshipGroupX
Follow the naming conventions exactly as instructed. The backend code will be integrated with the front-end application which means any mismatch in the expected request body will lead to failure in successful integration.
Models
College Model
{ name: { mandatory, unique, example iith}, fullName: {mandatory, example `Indian Institute of Technology, Hyderabad`}, logoLink: {mandatory}, isDeleted: {boolean, default: false} }
Intern Model
{ name: {mandatory}, email: {mandatory, valid email, unique}, mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}
POST /functionup/colleges
Create a college - a document for each member of the group

The logo link will be provided to you by the mentors. This link is a s3 (Amazon's Simple Service) url. Try accessing the link to see if the link is public or not.

Endpoint: BASE_URL/functionup/colleges

POST /functionup/interns
Create a document for an intern.

Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}

Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like this

Return HTTP status 400 for an invalid request with a response body like this

GET /functionup/collegeDetails
Returns the college details for the requested college (Expect a query parameter by the name collegeName. This is anabbreviated college name. For example iith)
Returns the list of all interns who have applied for internship at this college.
The response structure should look like this
Testing
To test these apis create a new collection in Postman named Project 2 Internship
Each api should have a new request in this collection
Each request in the collection should be rightly named. Eg Create college, Get college details etc
Each member of each team should have their tests in running state
Refer below sample

------------------------------------------------------------------------------------------------------------------------------------------------------------
# Solution of Project 2 [Internship Project]
## Models
- Firstly we have to create 2 models, collegeModel & internModel,& we have used the mentioned keys in our models with mentioned features(like mandatory,unique etc.).
## Controllers
- After creating the models we have created the three API's in controllers.There are two controllers, collegeController & internController.
### collegeController
- In collegeController we have wrote 2 API's 
- [POST /functionup/colleges]-> This post api is used to create college document.For creating a college document we must receive some data(like name,fullName,logoLink,isDeleted) in request body.Logolink was provided by our mentors.
- [GET /functionup/collegeDetails]-> This get api is used to fetch all the college data with the intern details who have been registered in that particular college by using the college name(abbreviate name) in query params.
### internController
- In internController we have wrote one api [POST /functionup/interns] which is used to create intern documents.For creating an intern document we must receive (neme,email,mobile,isDeleted)in request body & also receive the college name(abbreviate name) in query params by using that name we should fetch the collegeId & store that id in interns document.
- We have validate some data like email,mobile no & logolink before using them in our code.

Group Members:
- Shatrudhan Kumar
- Mazhar Alam
- Mohammed Saleem
- Ravikant 

