const messageModel = require("../models/message.model")
const userModel = require("../models/user.model")
const uploadFile = require("../services/imageKit.service")
const { getReceiverSocketId, getIO } = require("../services/socket");

async function getMessages(req, res) {
    try {
        const user = req.user
        const { userId } = req.params
        const messages = await messageModel.find({
            $or: [
                { senderId: user._id, receiverId: userId },
                { senderId: userId, receiverId: user._id },

            ]
        })
            .sort({ createdAt: 1 })
            .populate('senderId', 'fullName profilePic')
            .populate('receiverId', 'fullName profilePic')

        return res.status(200).json(({
            message: "Messages Successfully fetched",
            messages
        }))
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}


async function sendMessage(req, res) {
    try {
        const user = req.user
        const { userId } = req.params
        const { content } = req.body
        const file = req.file
        let image = ""
        if (file) {
            const uploadResult = await uploadFile(file)
            image = uploadResult.url || uploadResult
        }
        const sender = await userModel.findById(user._id)
        const receiver = await userModel.findById(userId)

        const newMessage = await messageModel.create({
            senderId: sender._id,
            receiverId: receiver._id,
            content: content || "",
            image
        })

        const receiverSocketId = getReceiverSocketId(receiver._id);
        if (receiverSocketId) {
            const io = getIO();
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        const populatedMessage = await messageModel.findById(newMessage._id)
            .populate('senderId', 'fullName profilePic')
            .populate('receiverId', 'fullName profilePic')

        return res.status(200).json({
            message: "Message Sent Successfully",
            messageData: populatedMessage
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = { sendMessage, getMessages }