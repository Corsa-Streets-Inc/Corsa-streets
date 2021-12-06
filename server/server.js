const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (sock) => {
    sock.emit('message', "you are connected")

    sock.on('message', (text) => io.emit('message', text))
})

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, '192.168.3.24', () => {
    console.log("here we go!")
})