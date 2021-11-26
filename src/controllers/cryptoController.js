const axios = require("axios");
const cryptomodel = require("../model/cryptomodel")
const getcrypto = async function (req, res) {
    try {
        let options = {
            method: "get",
            url: "http://api.coincap.io/v2/assets",
        };
        const cryptodata = await axios(options);
        let arr = []

        let obj

        for (let i = 0; i < cryptodata.data.data.length; i++) { //Here we are calling the array data which is present in an object data,& the object data is present in cryptodata.

            obj = {
                name: cryptodata.data.data[i].name, symbol: cryptodata.data.data[i].symbol,
                marketCapUsd: cryptodata.data.data[i].marketCapUsd, priceUsd: cryptodata.data.data[i].priceUsd
            } //saving all coins data using for loop from data array

            arr.push(obj) //pushing the object obj in arr,it is not necessary I did for checking.
            await cryptomodel.create(obj) //creating the data in database

        }
        let sorted = cryptodata.data.data.sort(function (a, b) { return a.changePercent24Hr - b.changePercent24Hr })//this line of code gives us the sorted array of data.

        res.status(200).send({ msg: "Successfully fetched data", data: sorted });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Some error occured" });
    }

};

module.exports.getcrypto = getcrypto