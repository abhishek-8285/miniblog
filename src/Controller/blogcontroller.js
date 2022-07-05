const { isValidObjectId } = require("mongoose");
const authorModel = require("../model/authorModel");
const blogModel = require("../Model/blogModel");

const validation=require("../validation/validator")
const{isValid,isObjectValid,isValidBody,isValidName,isValidType,validateEmail}=validation


const createBlog = async function (req, res) {
  try {

    let blogData = req.body;

    if(!isValidBody(blogData)){
      return res.status(400).send({ status: false, msg: "title is required" });
    }
    const {title,body,tags,category,subcategory,isPublished,authorId}=blogData

    if(!isValid(title)||!isValidType(title)){
      return res.status(400).send({ status: false, msg: "title is required and type must be string" })
  }
  if(!isValid(body)||!isValidType(body)){
    return res.status(400).send({ status: false, msg: "body is required and type must be string" })
  }

        if(!isValid(tags)){
      return res.status(400).send({ status: false, msg: "tags is required and type must be string" })
    }
    if(!isValid(category)||!isValidType(category)){
      return res.status(400).send({ status: false, msg: "category is required and type must be string" })
    }

    if(!isValid(subcategory)){
      return res.status(400).send({ status: false, msg: "subcategory is required and type must be string" })
    }


    if(!isValid(authorId)||!isValidType(authorId)){
      return res.status(400).send({ status: false, msg: "authorId is required and type must be string" })
    }
   
    if (!isObjectValid(authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "authorId is not valid" });
    }
    if(isPublished!==undefined){
      blogData['publishedAt']=isPublished?new Date():null
    }
   

    let authorIdfind = await authorModel.findById(authorId);
    if (!authorIdfind) {
      return res
        .status(404)
        .send({ status: false, msg: "author is not exist" });
    }
    let blogcreate = await blogModel.create(blogData);
    return res.status(201).send({ status: true, data: blogcreate });
    
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    const{authorId,category,tags,subcategory}=data
  
    let query = { isDeleted: false, isPublished: true };

    if (authorId) {
      if (!isValid(authorId)||authorId.trim().length===0) {
        return res
          .status(400)
          .send({ status: false, msg: "authorId need some value " });
      } else if(!isObjectValid(authorId)) {
        return res
          .status(400)
          .send({ status: false, msg: "authorId is not valid" });
      }else{ query.authorId = authorId
      }
    }
   
    if (tags) query.tags = { $in: tags };

    if (category) query.category = category;

    if (subcategory) query.category = {$in: subcategory};

    let getdata = await blogModel.find(query);

    if (getdata.length > 0) {
      res.status(200).send({ status: true, data: getdata });
    } else {
      res.status(404).send({ status: false, msg: "data not found" });
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;

    const requestbody = req.body;

    const decodedAuthor=  req["decodedauthor"]

    if (!isObjectValid(blogId)) {
      return res.status(400).send({ status: false, msg: "Id is not valid" });}

    if (!isObjectValid(decodedAuthor)) {
      return res.status(400).send({ status: false, msg: "authorId is not valid" });}

    const blog=await blogModel.findOne({_id:blogId,isDeleted:false})

    if(!blog){
      return res.status(404).send({status:false, message:"no data found"})
    }
    
    if(blog.authorId.toString()!==decodedAuthor){
      return res.status(403).send({status: false, msg: "User logged is not allowed to modify the requested users data",});}

    if(!isValidBody(requestbody)){
      res.status(200).send({status:true,message:"no data found inside body ", data:blog})
    }
    const{title,body,tags,subcategory,isPublished}=requestbody
    
    let filteredBody = {};
    let filterBodyArr={};
    if(isValid(title)&&isValidType(title)){
    
      filteredBody['title']=title
    }

    if(isValid(body)&&isValidType(body)){
     
      filteredBody['body']=body
    }



    if(isPublished!==undefined){
      
      filteredBody['isPublished']=isPublished
      filteredBody['publishedAt']=isPublished?new Date():null
    }

    if(tags){
      
      if(Array.isArray(tags)){
        filterBodyArr['tags']={$each:[...tags]}
      }
      if(typeof tags ==="string"){
        filterBodyArr['tags']=tags
      }
    }

    if(subcategory){
      
      if(Array.isArray(subcategory)){
        filterBodyArr['subcategory']={$each:[...subcategory]}
      }
      if(typeof subcategory ==="string"){
        filterBodyArr['subcategory']=subcategory
      }
    }
  
    let updatedData = await blogModel.findOneAndUpdate({ _id: blogId},{$set:filteredBody,$addToSet:filterBodyArr},{new:true});

    if (updatedData) {

        res.status(200).send({ status: true, data: updatedData });
      
    } else {
      res.status(404).send({status: false, msg:"data not found"});
    }
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
};

const deleteById = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    const decodedAuthor=  req["decodedauthor"]

    if (!isObjectValid(blogId)) {
      return res.status(400).send({ status: false, msg: "Id is not valid" });}

    if (!isObjectValid(decodedAuthor)) {
      return res.status(400).send({ status: false, msg: "authorId is not valid" });}

    const blog=await blogModel.findOne({_id:blogId,isDeleted:false})

    if(!blog){
      return res.status(404).send({status:false, message:"no data found"})
    }
    
    if(blog.authorId.toString()!==decodedAuthor){
      return res.status(403).send({status: false, msg: "User logged is not allowed to modify the requested users data",});}
    

    let isDataExist = await blogModel.findOneAndUpdate({_id:blog._id},{ $set: { isDeleted: true, deletedAt: new Date() }});
    if (!isDataExist) {
      return res.status(404).send({ status: false, msg: "Data not found" });
    }
      res.status(200).send({ status: true, data:""});
    
  } catch (err) {
    res.status(500).send({ err: err });
  }
};



const deleteByQuery =  async function (req, res) {
    try {
      const filteredBody={isDeleted:false}

      const query=req.query
      const decodedAuthor=  req["decodedauthor"]

      if(!isValidBody(query)){
        return res.status(200).send({status:false,message:"no data found inside query ",})
      }

      if (!isObjectValid(decodedAuthor)) {
        return res.status(400).send({ status: false, msg: "authorId is not valid" });}

      const{authorId,category,tags,subcategory,isPublished}=query

      if(isValid(authorId)&&isValidObjectId(authorId)){
        filteredBody['authorId']=authorId;
      }

      if(isValid(category)){
        filteredBody['category']=category
      }
      if(isValid(isPublished)){
        filteredBody['isPublished']=isPublished
      }
      if(isValid(tags)){
        const tag=tags.trim().split(',').map(a=>a.trim());
        filteredBody['tags']={$all:tag}
      }
      if(isValid(subcategory)){
        const tag=subcategory.trim().split(',').map(a=>a.trim());
        filteredBody['subcategory']={$all:tag}
      }

      const blog=await blogModel.find(filteredBody)

      if(Array.isArray(blog)&&blog.length===0){
        return res.status(404).send({ status: false, msg:"no data found" })
      }

      const ids=blog.map(id=>{if(id.authorId.toString()===decodedAuthor)return id._id})
      if(ids.length===0){
        return res.status(404).send({ status: false, msg:"no data found" })
      }
    
      const del=await blogModel.updateMany({_id:{$in:ids}}, {$set: { isDeleted: true,deletedAt:new Date() }});
      return res.status(200).send({ status: true, msg:del });
    
    } catch (error) {
      res.status(500).send({ err: error });
    }
};

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteById = deleteById;
module.exports.deleteByQuery = deleteByQuery;
