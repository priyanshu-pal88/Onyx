const express = require('express')
const { registerUser, loginUser, logoutUser, updateUser, verifyUser } = require('../controllers/auth.controllers')
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');



const authRouter = express.Router()


authRouter.post('/register',upload.single('image'),registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',logoutUser)
authRouter.patch('/update-user',authMiddleware,upload.single('image'),updateUser)
authRouter.get('/verify',authMiddleware,verifyUser)

module.exports = authRouter