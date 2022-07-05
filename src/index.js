const express=require('express')
const bodyParser=require('body-parser')
const route=require('./router/route')
const mongoose=require('mongoose')
const app=express()

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://betechnoid:Abhishek8285366507@cluster0.ctbkbk3.mongodb.net/project1?retryWrites=true&w=majority",{
    useNewUrlParser:true
})
.then(()=>console.log('Mongo is connected'))
.catch(err=> console.log(err))

app.use('/', route)

app.listen(process.env.PORT||3000, ()=>console.log("Express app running on port "+(process.env.PORT||3000)))