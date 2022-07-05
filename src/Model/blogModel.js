const mongoose = require('mongoose')
let ObjectId=mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
        require:true
    }, 
    body: {
        type:String,
        require:true
    }, 
    authorId: {
        type:ObjectId,
        ref:'authorss',
        require:true},
    tags:Array, 
    category: {
        type:String, 
        require:true
    }, 
    subcategory: {
        type:Array
    }, 
    isDeleted: {
        type:Boolean, 
        default:false
    }, 
    publishedAt: {
        type:Date,
        default:null
        
    }, 
    isPublished: {
        type:Boolean, 
        default: false
    },
    deletedAt:{
        type:Date,
        default:null
    }

}, {timestamps:true})

module.exports = mongoose.model('blog', blogSchema)
