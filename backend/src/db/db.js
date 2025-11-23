require('dotenv').config()
const mongoose = require("mongoose");


async function connectToDB(){
    await mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to Database Successfully")
    })
    .catch((e)=>{
        console.log("Can not connect to database", e)
    })

}

module.exports = connectToDB