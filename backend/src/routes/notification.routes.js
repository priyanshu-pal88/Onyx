const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getNotifications, createNotification } = require('../controllers/notification.controllers');


const notificationRouter = express.Router();


notificationRouter.get('/', authMiddleware, getNotifications)
notificationRouter.get('/create', authMiddleware, createNotification)

module.exports = notificationRouter;