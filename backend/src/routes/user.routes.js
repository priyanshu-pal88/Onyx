const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const {getUserProfile, sendFriendReq, acceptFriendReq, rejectFriendReq, getFriends, getSuggestedUsers, removeFriend, searchUsers} = require('../controllers/user.controllers')

const userRouter = express.Router()

userRouter.get('/profile/:userId',authMiddleware,getUserProfile)
userRouter.get('/friends',authMiddleware,getFriends)
userRouter.get('/suggested',authMiddleware,getSuggestedUsers)
userRouter.get('/search',authMiddleware,searchUsers)
userRouter.post('/friends/send/:userId',authMiddleware,sendFriendReq)
userRouter.post('/friends/accept/:userId',authMiddleware,acceptFriendReq)
userRouter.post('/friends/reject/:userId',authMiddleware,rejectFriendReq)
userRouter.post('/friends/remove/:userId',authMiddleware,removeFriend)


module.exports = userRouter