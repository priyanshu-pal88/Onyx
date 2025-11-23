const commentModel = require("../models/comment.model")
const postModel = require("../models/post.model")
const { sendNotification } = require("../services/notificationService")


async function getComments(req, res) {
    try {
        const { postId } = req.params
        const comments = await commentModel.find({
            postId: postId
        })
            .populate("userId", "fullName profilePic")

        return res.status(200).json({
            message: "Fetched the comments for the post Successfully",
            comments
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

async function createComment(req, res) {
    try {
        const user = req.user
        const { postId } = req.params
        const { text } = req.body
        const comment = await commentModel.create({
            postId: postId,
            userId: user._id,
            text: text
        })
        const post = await postModel.findByIdAndUpdate(postId, { $push: { comments: comment._id } })
        
        // Only send notification if user is not commenting on their own post
        if (post.userId.toString() !== user._id.toString()) {
            await sendNotification({
                type: "comment",
                senderId: user._id,
                receiverId: post.userId,
                message: `${user.fullName.firstName} ${user.fullName.lastName} commented on your post`,
            });
        }
        
        return res.status(201).json({
            message: "Comment added Successfully",
            comments: comment
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Sevver Error"
        })
    }
}

async function editCommment(req, res) {
    try {

        const user = req.user

        const { id, text } = req.body
        const comment = await commentModel.findById(id)

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to edit this comment" });
        }

        comment.text = text;
        await comment.save();
        await comment.populate("userId", "fullName profilePic");

        return res.status(200).json({
            message: "Comment edited Successfully",
            comment
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

async function deleteComment(req, res) {
    try {
        const user = req.user
        const { postId, id } = req.params

        const comment = await commentModel.findById(id)
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to delete this comment" })
        }

        await commentModel.findByIdAndDelete(id)
        await postModel.findByIdAndUpdate(postId, { $pull: { comments: id } })
        return res.status(200).json({
            message: "Comment deleted Successfully"
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = { createComment, editCommment, deleteComment, getComments }