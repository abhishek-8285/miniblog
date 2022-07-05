let mongoose = require("mongoose");

const isObjectValid = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const isValid=function(value){
    if(typeof value ==='undefined'||value===null){return false}
    return true
}

const isValidType=function(value){
    if(typeof value!=="string"||value.trim().length===0){ return false}
    return true
}

const isValidBody=function (reqbody){
    return Object.keys(reqbody).length>0
}
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const isValidName=function (name) {
    var re = /^[A-Za-z]+$/;
    return re.test(name)
    
}

module.exports={isValid,isObjectValid,isValidBody,isValidName,isValidType,validateEmail}
