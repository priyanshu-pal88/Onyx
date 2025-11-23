require('dotenv').config()
const app = require('./src/app');
const connectToDB = require('./src/db/db');
const http = require('http');
const {initSocketServer} = require('./src/services/socket');

connectToDB()
const server = http.createServer(app);
initSocketServer(server);

server.listen(3000,()=>{
    console.log("Server is running on port 3000")
})