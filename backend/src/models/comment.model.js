const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    postId: { type : mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
    userId: { type : mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    text : {type : String , required : true}
},{timestamps : true})

const commentModel = mongoose.model("comments",commentSchema)

module.exports = commentModel