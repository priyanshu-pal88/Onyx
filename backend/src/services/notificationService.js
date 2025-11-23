const notificationModel = require("../models/notification.model");
const { getIO, getReceiverSocketId } = require("./socket");

async function sendNotification(payload) {
    const io = getIO();
    const {
        type,
        senderId,
        receiverId,
        message,
        postId = null,
        commentId = null,
    } = payload;

    // const notif = await notificationModel.create({
    //     type,
    //     senderId,
    //     receiverId,
    //     message,
    //     postId,
    //     commentId,
    // });

    try {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("notification", {
                
                type: type,
                senderId: senderId,
                receiverId: receiverId,
                message: message,
                postId: postId,
                commentId: commentId,
                
            });
        }

    } catch (err) {
        console.error("Error emitting notification:", err);
    }

    return null; // Return null or the created notification object if needed
}

module.exports = {
    sendNotification
};
