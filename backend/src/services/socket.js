const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

let io;
let userSocketMap = {};

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

function initSocketServer(server) {
    io = new Server(server, {
        cors: {
            origin: "https://onyx-eta-one.vercel.app",
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected: ", socket.id);
        const { userId } = socket.handshake.auth;
        if (userId) {
            userSocketMap[userId] = socket.id;
            console.log("User connected:", userId);
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));


        socket.on("getOnlineUsers", () => {
            socket.emit("getOnlineUsers", Object.keys(userSocketMap));
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected: ", socket.id);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
        );

    }
    );
}

module.exports = { initSocketServer, getReceiverSocketId, getIO: () => io };