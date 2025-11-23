const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },

    profilePic: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
}, {
    timestamps: true
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel