const axios = require("axios");

// res.status(200). send( { data: userDetails } )

const getStatesList = async function (req, res) {
  try {
    let options = {
      method: "get",
      url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
    };
    const cowinStates = await axios(options);

    console.log("WORKING");
    let states = cowinStates.data;
    res.status(200).send({ msg: "Successfully fetched data", data: states });

  }
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};


const getDistrictsList = async function (req, res) {

  try {
    let id = req.params.stateId
    console.log(" state: ", id)

    let options = {
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}` //plz take 5 mins to revise template literals here
    }
    let response = await axios(options)

    let districts = response.data

    console.log(response.data)
    res.status(200).send({ msg: "Success", data: districts })

  }
  catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: "Something went wrong" })
  }
}

const getByPin = async function (req, res) {

  try {

    let pin = req.query.pincode
    let date = req.query.date

    let options = {
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
    }
    let response = await axios(options)



    let centers = response.data
    console.log(centers)
    res.status(200).send({ msg: "Success", data: centers })

  }
  catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: "Something went wrong" })
  }
}


const getOtp = async function (req, res) {

  try {

    let options = {
      method: "post", // method has to be post
      url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
      data: { "mobile": req.body.mobile } // we are sending the json body in the data 
    }
    let response = await axios(options)
    console.log(response)
    let id = response.data
    res.status(200).send({ msg: "Success", data: id })

  }
  catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: "Something went wrong" })
  }
}

//AXOIS Assignment




const londonTemp = async function (req, res) {
  try {
    let city = req.query.q;
    let key = req.query.appid

    let options = {
      method: "get",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`,
    };
    const weatherdata = await axios(options);

    console.log(weatherdata)
    // let london = weatherdata;
    res.status(200).send({ msg: "Successfully fetched data", data: weatherdata.data.main.temp });

  }
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured", err });
  }

};

//PROBLEM 3
const Temp = async function (req, res) {
try{
      let x = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
      let cityTemp = []
      for (let i = 0; i < x.length; i++) {
        obj = { city: x[i] }
        let response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${x[i]}&appid=501c4da9141bac955a83bc7512e6bdfd`);
        obj.temp = response.data.main.temp
        cityTemp.push(obj)
      }
      let sortedTemp= cityTemp.sort(function(a,b){return a.temp - b.temp})
      res.status(200).send({msg:"Successful",data:sortedTemp})
   }catch(err){
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured", err });
   }


}

const london = async function (req, res) {
  try {
   

    let options = {
      method: "get",
      url: `http://localhost:3000/city/temp?q=London&appid=501c4da9141bac955a83bc7512e6bdfd`,
    };
    const weatherdata = await axios(options);

    console.log(weatherdata)
    // let london = weatherdata;
    res.status(200).send({ msg: "Successfully fetched data", data: weatherdata.data });

  }
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured", err });
  }

};




module.exports.getStatesList = getStatesList;
module.exports.getDistrictsList = getDistrictsList;
module.exports.getByPin = getByPin;
module.exports.getOtp = getOtp;
module.exports.london = london;
module.exports.londonTemp = londonTemp;
module.exports.Temp = Temp;