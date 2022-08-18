const authorModel=require("../model/authorModel")
const jwt = require("jsonwebtoken");
const validation=require("../validation/validator")
const{isValid,isObjectValid,isValidBody,isValidName,isValidType,validateEmail}=validation



const createAuthor=async function (req,res){
try{

    let authordata=req.body
    if(!isValidBody(authordata)){
      return res.status(400).send({ status: false, msg: "required some fields" })
    }
    const{fname,lname,title,email,password,}=authordata

    if(!isValid(fname)||!isValidType(fname)){
        return res.status(400).send({ status: false, msg: "fName is required and type must be string" })
    }
    
    if(!isValid(lname)||!isValidType(lname)){
      return res.status(400).send({ status: false, msg: "lname is required and type must be string" })
     }
  if(!isValid(title)||!isValidType(title)){
    return res.status(400).send({ status: false, msg: "title is required and type must be string" })
  }

    if(!["Miss","Mr","Mrs"].includes(title)){
      return res.status(400).send({ status: false, msg: 'please use only these titles "Mr","Mrs","Miss"' })
    }

    if(!isValid(email)||!isValidType(email)){
      return res.status(400).send({ status: false, msg: "email is required and type must be string" })
  }
    if(!validateEmail(email)){
      return res.status(400).send({ status: false, msg: "email is not valid" })
    }
    
    if(!isValid(password)||!isValidType(password)){
      return res.status(400).send({ status: false, msg: "password is required and type must be string" })
  }
    
    let emaildata=await authorModel.findOne({email:authordata.email})

    if(emaildata){
      return res.status(400).send({ status: false, msg: "use different emailId" })
    }
    
    let author=await authorModel.create(authordata)
     return res.status(201).send({status: true,data:author})
    
}catch(err){

   return res.status(500).send({status: false, msg:err});
}
}

const loginAuthor = async function (req, res) {
  try {
    let body=req.body
    if(!isValidBody(body)){
      return res.status(400).send({ status: false, msg: "email and password is requird" })
    }
    const {email,password}=body

    if(!isValid(email)||!isValidType(email)){
      return res.status(400).send({ status: false, msg: "email is required and type must be string" })
  }
  if(!isValid(password)||!isValidType(password)){
    return res.status(400).send({ status: false, msg: "password is required and type must be string" })
}

  
    let user = await authorModel.findOne({ email: email, password: password });
    if (!user)
      return res.status(401).send({
        status: false,
        msg: "email or the password is not corerct",
      });
  
  
    let token = jwt.sign(
      {
        authorId: user._id.toString(),
        batch: "Radon",
        organisation: "FunctionUp",
      },
      "projectone"
    );
   return res.status(201).send({ status: true, data:{ token:token, authorId:user._id }});
  } catch (error) {
    return res.status(500).send({status: false, msg:err});
  }
  };

module.exports.loginAuthor=loginAuthor
module.exports.createAuthor=createAuthor