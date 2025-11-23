const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const postRouter = require('./routes/post.routes')
const commentRouter = require('./routes/comment.routes')
const userRouter = require('./routes/user.routes')
const messageRouter = require('./routes/message.routes')
const cors = require('cors')
const notificationRouter = require('./routes/notification.routes')


const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://onyx-eta-one.vercel.app",
    credentials: true
}))
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)
app.use('/api/users', userRouter)
app.use('/api/messages', messageRouter)
app.use('/api/notifications', notificationRouter)

module.exports = app;


