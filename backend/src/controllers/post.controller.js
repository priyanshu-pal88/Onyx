const postModel = require("../models/post.model");
const uploadFile = require("../services/imageKit.service");
const { sendNotification } = require("../services/notificationService");


async function getPosts(req, res) {
    try {
        const user = req.user

        const posts = await postModel.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "fullName profilePic"
                }
            })
            .populate("userId", "fullName profilePic")
            .exec();

        if (!posts) {
            return res.status(404).json({
                message: "User has not posted anything yet"
            })
        }

        return res.status(200).json({
            message: "Successfully fetched all the posts for ther user",
            posts
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

async function getUserPosts(req, res) {
    try {
        const { userId } = req.params

        const posts = await postModel.find({ userId: userId })
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "fullName profilePic"
                }
            })
            .populate("userId", "fullName profilePic")
            .exec();

        if (!posts) {
            return res.status(404).json({
                message: "User has not posted anything yet"
            })
        }

        return res.status(200).json({
            message: "Successfully fetched all the posts for ther user",
            posts
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}




async function createPost(req, res) {
    try {
        const user = req.user
        const { caption } = req.body
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const uploadResult = await uploadFile(file);
        const imageUrl = uploadResult.url;
        const post = await postModel.create({
            caption,
            imageUrl,
            userId: user.id
        })

        return res.status(201).json({
            message: " Post cretaed successfully",
            post
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function likePost(req, res) {
    try {
        const user = req.user
        const { id } = req.params
        const post = await postModel.findOne({ _id: id })
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }
        if (post.likes.includes(user._id)) {

            post.likes.pull(user._id)
            await post.save()


            return res.status(200).json({
                message: "Unliked the post"
            })
        }
        else {
            post.likes.push(user._id)
            await post.save()


            if (post.userId.toString() !== user._id.toString()) {
                await sendNotification({
                    type: "like",
                    senderId: user._id,
                    receiverId: post.userId,
                    message: `${user.fullName.firstName} liked your post`,
                });
            }

            return res.status(200).json({
                message: "Liked the post"
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function editPost(req, res) {
    try {
        const user = req.user
        const { id } = req.params
        const { caption } = req.body
        const post = await postModel.findOneAndUpdate({ _id: id }, {
            caption: caption
        }, { new: true })
        return res.status(200).json({
            message: "Edited the Post Successfully",
            post
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

async function deletePost(req, res) {
    try {
        const { id } = req.params
        await postModel.findOneAndDelete({ _id: id })
        return res.status(200).json({
            message: "Post deleted Successfully"
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

async function getFeedPosts(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        const posts = await postModel.find()
            .sort({ createdAt: -1 }) // Latest first
            .skip(skip)
            .limit(parseInt(limit))
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "fullName profilePic"
                }
            })
            .populate("userId", "fullName profilePic")
            .exec()

        const totalPosts = await postModel.countDocuments()

        return res.status(200).json({
            message: "Successfully fetched feed posts",
            posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts,
                hasMore: skip + posts.length < totalPosts
            }
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}



module.exports = { createPost, getPosts, likePost, editPost, deletePost, getUserPosts, getFeedPosts }