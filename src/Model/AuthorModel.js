const mongoose = require('mongoose');



const authorSchema = new mongoose.Schema({
    fname:{
        type:String,
        require: true,
        trim:true
    }, 
    lname: {
        type:String,
        require:true,
        trim:true
    }, 
    title: {
        type:String,
        enum:["Mr", "Mrs", "Miss"],
        require:true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: { 
        type: String,
         required: true 
    }    

}, {timestamps:true});

module.exports = mongoose.model('authorss', authorSchema)