const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { sendMessage, getMessages } = require('../controllers/message.controllers')
const upload = require('../middlewares/multerMiddleware')

const messageRouter = express.Router()

messageRouter.post('/send/:userId',authMiddleware,upload.single('file'),sendMessage)
messageRouter.get('/:userId',authMiddleware,getMessages)


module.exports = messageRouter