const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const {createPost, getPosts, likePost, editPost, deletePost, getUserPosts, getFeedPosts} = require('../controllers/post.controller')
const upload = require('../middlewares/multerMiddleware')


const postRouter = express.Router()


postRouter.get('/',authMiddleware,getPosts)
postRouter.get('/feed',authMiddleware,getFeedPosts)
postRouter.get('/user/posts',authMiddleware,getUserPosts)
postRouter.post('/create',authMiddleware,upload.single("file"),createPost)
postRouter.get('/like/:id',authMiddleware,likePost)
postRouter.patch('/edit/:id',authMiddleware,editPost)
postRouter.delete('/delete/:id',authMiddleware,deletePost)


module.exports = postRouter