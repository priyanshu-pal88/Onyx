const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')


async function authMiddleware(req,res,next) {

    const {token} = req.cookies
    if(!token){
        return res.status(401).json({
            message : "Unauthorized User"
        })
    }

    const decoded =  jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({
            message : "Unautorized User"
        })
    }

    const user = await userModel.findById(decoded.id)
    if(!user){
        return res.status(401).json({
            message : "Unauthorized User"
        })
    }
    req.user = user
    next()
    
}

module.exports = authMiddleware