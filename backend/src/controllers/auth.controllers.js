const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uploadFile = require("../services/imageKit.service")



async function registerUser(req, res) {

    try {
        const { email, password, bio, fullName: { firstName, lastName } } = req.body
        const file = req.file
        const isUserExist = await userModel.findOne({ email })
        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists, try to Login"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        let profilePic = ""
        if (file) { profilePic = await uploadFile(file); }
        const user = await userModel.create({
            email,
            password: hashedPassword,
            profilePic,
            bio,
            fullName: {
                firstName,
                lastName
            }
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token)

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio,
                fullName: user.fullName
            }
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" })

    }

}

async function loginUser(req, res) {

    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token)
        return res.status(200).json({
            message: "User Logged in Successfully",
            user: {
                _id: user._id,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio,
                fullName: user.fullName,
                friends: user.friends
            }
        })
    }

    catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" })
    }


}

async function logoutUser(req, res) {

    try {
        res.clearCookie("token")
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" })
    }


}

async function updateUser(req, res) {
    try {
        const user = req.user;
        const { bio, firstName,lastName, password } = req.body || {};
        let fullName = { firstName, lastName };


        const updates = {};

        if (req.file) {
            const uploaded = await uploadFile(req.file);
            updates.profilePic = uploaded.url;
        }
        if (bio) updates.bio = bio;


        if (fullName) {
            if (typeof fullName === "string") {
                fullName = JSON.parse(fullName);
            }
            updates.fullName = {
                firstName: fullName.firstName || user.fullName.firstName,
                lastName: fullName.lastName || user.fullName.lastName
            };
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        const newUser = await userModel.findByIdAndUpdate(
            user._id,
            { $set: updates },
            { new: true }
        );

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: newUser._id,
                email: newUser.email,
                profilePic: newUser.profilePic,
                bio: newUser.bio,
                fullName: newUser.fullName
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function verifyUser(req, res) {
    try {
        const user = req.user

        return res.status(200).json({
            message: "User verified successfully",
            user: {
                _id: user._id,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio,
                fullName: user.fullName,
                friends: user.friends

            }
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }


}


module.exports = {
    registerUser, loginUser, logoutUser, updateUser, verifyUser
}