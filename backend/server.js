require('dotenv').config()
const app = require('./src/app');
const connectToDB = require('./src/db/db');
const http = require('http');
const {initSocketServer} = require('./src/services/socket');

connectToDB()
const server = http.createServer(app);
initSocketServer(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log("Server is running on port 3000")
})