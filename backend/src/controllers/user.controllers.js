const mongoose = require('mongoose')
const userModel = require('../models/user.model')
const postModel = require('../models/post.model')
const { sendNotification } = require('../services/notificationService')

async function getUserProfile(req, res) {
    try {
        const { userId } = req.params
        const user = await userModel.findById(userId)
        const posts = await postModel.find({ userId: userId })
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "firstName profilePic"
                }
            })
            .populate("userId", "fullName profielPic")

        return res.status(200).json({
            message: "Fetched the User's Info Successfully",
            user,
            posts
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getFriends(req, res) {
    try {
        const user = req.user
        const friend = await userModel.findById(user.id)
            .populate("friends", "fullName profilePic")
            .populate("friendRequestsReceived", "fullName profilePic")
            .populate("friendRequestsSent", "fullName profilePic");

        res.status(200).json({
            friends: friend.friends,
            receivedRequests: friend.friendRequestsReceived,
            sentRequests: friend.friendRequestsSent
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function sendFriendReq(req, res) {
    try {
        const user = req.user
        const { userId } = req.params
        const sender = await userModel.findOne({ _id: user.id })
        const receiver = await userModel.findOne({ _id: userId })

        if (!receiver) return res.status(404).json({ message: "User not found" });
        if (sender._id.equals(receiver._id)) return res.status(400).json({ message: "You can't send request to yourself" });
        if (sender.friends.includes(receiver._id)) return res.status(400).json({ message: "Already friends" });
        if (sender.friendRequestsSent.includes(receiver._id)) return res.status(400).json({ message: "Request already sent" });

        sender.friendRequestsSent.push(receiver._id);
        receiver.friendRequestsReceived.push(sender._id);

        await sender.save();
        await receiver.save();

        await sendNotification({
            type: "friendRequest",
            senderId: sender._id,
            receiverId : receiver._id,
            message: `${sender.fullName.firstName} sent you a friend request`,
        });


        res.status(200).json({ message: "Friend request sent" });


    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

async function acceptFriendReq(req, res) {
    try {
        const user = req.user
        const { userId } = req.params
        const receiver = await userModel.findById(user.id);
        const sender = await userModel.findById(userId);

        if (!receiver.friendRequestsReceived.includes(sender._id)) {
            return res.status(400).json({ message: "No request from this user" });
        }

        receiver.friends.push(sender._id);
        sender.friends.push(receiver._id);

        receiver.friendRequestsReceived.pull(sender._id);
        sender.friendRequestsSent.pull(receiver._id);

        await receiver.save();
        await sender.save();

         await sendNotification({
            type: "friendAccepted",
            senderId: receiver._id,
            receiverId : sender._id,
            message: `${receiver.fullName.firstName} accepted your friend request`,
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function rejectFriendReq(req, res) {
    try {
        const user = req.user
        const { userId } = req.params
        const receiver = await userModel.findById(user.id)
        const sender = await userModel.findById(userId)

        if (!receiver.friendRequestsReceived.includes(sender._id)) {
            return res.status(400).json({ message: "No pending request" });
        }

        receiver.friendRequestsReceived.pull(sender._id);
        sender.friendRequestsSent.pull(receiver._id);

        await receiver.save();
        await sender.save();

        res.status(200).json({ message: "Friend request rejected" });

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal  Server Error"
        })
    }
}

async function getSuggestedUsers(req, res) {
    try {
        const user = req.user
        const currentUser = await userModel.findById(user.id)

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" })
        }

  
        const suggestedUsers = await userModel.find({
            _id: {
                $ne: user.id,
                $nin: [
                    ...currentUser.friends,
                    ...currentUser.friendRequestsSent,
                    ...currentUser.friendRequestsReceived
                ]
            }
        })
            .select('fullName profilePic bio')
            .limit(10)

        return res.status(200).json({
            message: "Successfully fetched suggested users",
            users: suggestedUsers
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function removeFriend(req, res) {
    try {
        const user = req.user
        const { userId } = req.params
        const currentUser = await userModel.findById(user.id)
        const friendToRemove = await userModel.findById(userId)
        if (!friendToRemove) {
            return res.status(404).json({ message: "User not found" })
        }
        currentUser.friends.pull(friendToRemove._id)
        friendToRemove.friends.pull(currentUser._id)
        await currentUser.save()
        await friendToRemove.save()
        return res.status(200).json({
            message: "Friend removed successfully"
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function searchUsers(req, res) {
    try {
        const { query } = req.query
        
        if (!query || query.trim() === '') {
            return res.status(400).json({
                message: "Search query is required"
            })
        }


        const users = await userModel.find({
            $or: [
                { 'fullName.firstName': { $regex: query, $options: 'i' } },
                { 'fullName.lastName': { $regex: query, $options: 'i' } }
            ]
        })
        .select('fullName profilePic bio')
        .limit(20)

        return res.status(200).json({
            message: "Search completed successfully",
            users: users
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}





module.exports = { getUserProfile, getFriends, sendFriendReq, acceptFriendReq, rejectFriendReq, getSuggestedUsers, removeFriend, searchUsers }