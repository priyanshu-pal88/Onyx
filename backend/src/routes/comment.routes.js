const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const {createComment, editCommment, deleteComment, getComments} = require('../controllers/comment.controllers')

const commentRouter = express.Router()

commentRouter.get('/get/:postId',authMiddleware,getComments)
commentRouter.post('/create/:postId',authMiddleware,createComment)
commentRouter.patch('/edit',authMiddleware,editCommment)
commentRouter.delete('/delete/:postId/:id',authMiddleware,deleteComment)

module.exports = commentRouter