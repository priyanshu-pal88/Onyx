const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    caption : {type : String , default : ""},
    imageUrl : { type: String, default: "" },
    likes : [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],

    
},{timestamps : true})

const postModel = mongoose.model("posts",postSchema)

module.exports = postModel