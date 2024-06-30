const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({
    path:  './Config/config.env'
})

// dotenv module import all variable from config.env file
// moongoose is module that create connection between node file and mongodb

const connectDatabase = async  () => {

    await mongoose.connect(process.env.MONGO_URI ,{useNewUrlParser : true})

    console.log("MongoDB Connection Successfully")

}
// this function is used to connect backend with monogdb
module.exports = connectDatabase
