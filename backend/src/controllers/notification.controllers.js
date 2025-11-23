const mongoose = require('mongoose');
const notificationModel = require('../models/notification.model');
const { sendNotification } = require('../services/notificationService');


async function getNotifications(req, res) {
    try {
        const user = req.user;
        const notifications = await notificationModel.find({ receiverId: user._id })
            .sort({ createdAt: -1 })
            .populate('senderId', 'fullName profilePic')
            .populate('postId', 'imageUrl')
            .populate('commentId');
        return res.status(200).json({
            message: "Notifications successfully fetched",
            notifications
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function createNotification(req, res) {
  try {
    const senderId = req.user._id;
    const { type, receiverId, message, postId, commentId } = req.body;

    if (!type || !receiverId) {
      return res.status(400).json({ message: "type and receiverId required" });
    }

    const notif = await sendNotification({
      type,
      senderId,
      receiverId,
      message,
      postId,
      commentId,
    });

    return res.status(201).json({ notification: notif });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    getNotifications,createNotification
};