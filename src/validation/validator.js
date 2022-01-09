const mongoose = require('mongoose')
const isValid = function (value) {
    if (typeof value === "undefined" || value === null || value === Number) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
  
const validString = function(value) {
  if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
  return true;
}
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };

module.exports = {isValid,isValidRequestBody,isValidObjectId,validString}