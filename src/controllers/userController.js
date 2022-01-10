const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10
const userModel = require("../models/userModel");
const aws = require('aws-sdk')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const validator = require("../validation/validator");


aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",
  secretAccessKey: "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",
  region: "ap-south-1",
})

let uploadFile = async (file, group) => {
  return new Promise(function (resolve, reject) {

    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    let uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket",
      Key: group + "/16" + Date.now() + file.originalname,
      Body: file.buffer
    }

    s3.upload(uploadParams, function (err, data) {
      if (err) return reject({ "error": err })

      return resolve(data.Location);
    });

  });

}

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let files = req.files;
    const { fname, lname, email, phone, password, address } = data;

    if (!validator.isValidRequestBody(data)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters.. Please Provide User Details",
        });
    }

    if (!validator.isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide First Name" });
    }

    if (!validator.isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide last Name" });
    }

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Email" });
    }
    const isEmailAlreadyUsed = await userModel.findOne({ email }); // {email: email} object shorthand property 
    if (isEmailAlreadyUsed) {
      res.status(400).send({ status: false, message: `${email} email address is already registered` })
      return
    }

    if (!validator.isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid PhoneNo" });
    }
    const isPhoneNumberAlreadyUsed = await userModel.findOne({ phone: phone });
    if (isPhoneNumberAlreadyUsed) {
      res.status(400).send({ status: false, message: `${phone} mobile number is already registered`, });
      return;
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Password " });
    }
    if (!validator.isValid(password)) {
      res.status(400).send({ status: false, message: `${password} invalid` })
      return
    }
    if (!(password.trim().length > 7 && password.trim().length < 16)) {
      res.status(400).send({ status: false, message: `${password} invalid` })
      return
    }

    if (!validator.isValid(address)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Address" });
    }


    if (!address.shipping || (address.shipping && (!address.shipping.street || !address.shipping.city || !address.shipping.pincode))) {
      return res.status(400).send({ status: false, message: 'Shipping address is required' })
    }

    if (!address.billing || (address.billing && (!address.billing.street || !address.billing.city || !address.billing.pincode))) {
      return res.status(400).send({ status: false, message: 'Billing address is required' })
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      return res
        .status(400)
        .send({ status: false, message: `Enter a valid email address` });
    }

    if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gi.test(phone.trim())) {
      return res.status(400).send({
        status: false,
        message: "Phone should be a valid number",
      });
    }



    if (files && files.length > 0) {

      const uploadedFileURL = await uploadFile(files[0], 'user')
      data.profileImage = uploadedFileURL;
      // generate salt to hash password

      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      // now we set user password to hashed password
      data.password = await bcrypt.hash(password, encryptedPassword);
      const savedData = await userModel.create(data);
      return res
        .status(201)
        .send({ status: true, message: "Successfully Created", data: savedData });
    } else {
      return res
        .status(404)
        .send({ status: false, message: "Select an Image File" });
    }
  }

  catch (err) {
    return res.status(500).send({ status: false, "message": err.message })
  }

}

const Login = async (req, res) => {
  try {
    const Email = req.body.email;
    const Password = req.body.password;

    if (!Email || (typeof Email === 'string' && Email.trim().length === 0)) {
      return res.status(400).send({ status: false, message: "Email is required" })
    }

    if (!Password || (typeof Password === 'string' && Password.trim().length === 0)) {
      return res.status(400).send({ status: false, message: `Password is required` })
    }

    let user = await userModel.findOne({ email: Email });
    if (user) {

      const _id = user._id
      const name = user.fname
      const password = user.password

      const validPassword = await bcrypt.compare(Password, password);

      if (!validPassword) { return res.status(400).send({ status: false, message: " Invalid password" }); }
      let payload = { userId: _id };
      const generatedToken = jwt.sign(payload, "Exodus", { expiresIn: "30m" });

      res.header("user-login", generatedToken);

      return res
        .status(200).send({
          status: true, message: name + ", You have  logged in successfully",
          userId: _id,
          token: generatedToken,
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getUserData = async function (req, res) {

  try {
    const userId = req.params.userId

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
    }
    let userDetail = await userModel.findOne({ _id: userId })

    if (!userDetail) {
      res.status(400).send({ status: false, message: `No user exist with this ${userId}` })
    }

    res.status(200).send({ status: true, message: `Successlly fetched user details`, data: userDetail })
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}


const updateUser = async function (req, res) {
  try {
    const userId = req.params.userId
    const requestBody = req.body

    if (!Object.keys(requestBody).length > 0) {
      return res.status(200).send({ status: true, message: 'No param received, user details unmodified' })
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
    }

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" })
    }
    // Extract parameters
    let { fname, lname, email, phone, password, address, files } = req.body
    // Prepare update fields
    if (fname) {
      user['fname'] = fname
    }

    if (lname) {
      user['lname'] = lname
    }
    if (email) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: email + " is not a valid email address" })
      }
      user['email'] = email
    }

    if (phone) {

      if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(phone)) {
        return res.status(400).send({ status: false, message: String(phone) + ' should be a valid mobile number' })
      }
      user['phone'] = phone
    }

    if (password) {
      if (password.length < 8 || password.length > 16) {
        return res.status(400).send({ status: false, message: `Password lenght must be between 8 to 15 char long` })
      }

      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      user['password'] = encryptedPassword
    }
    if (address) {
      {
        if (address.shipping) {
          if (address.shipping.street) user.address.shipping['street'] = address.shipping.street
          if (address.shipping.city) user.address.shipping['city'] = address.shipping.city
          if (address.shipping.pincode) user.address.shipping['pincode'] = address.shipping.pincode
        }

        if (address.billing) {
          if (address.billing.street) user.address.billing['street'] = address.billing.street
          if (address.billing.city) user.address.billing['city'] = address.billing.city
          if (address.billing.pincode) user.address.billing['pincode'] = address.billing.pincode
        }
      }
    }

    if (files && files.length > 0) {
      const profileImage = await uploadFile(files[0], 'user')
      user['profileImage'] = profileImage
    }

    const updatedUser = await user.save()

    const strUserUpdate = JSON.stringify(updatedUser);
    const objUserUpdate = JSON.parse(strUserUpdate)

    delete (objUserUpdate.password)

    return res.status(200).send({ status: true, message: 'User profile updated', data: objUserUpdate })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


module.exports = { registerUser, Login, getUserData, updateUser }