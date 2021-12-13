const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);




io.on('connection', (sock) => {
    const id = Math.trunc(Math.random() * 100000);
    sock.emit('message', "you are connected", id)
    // sock.emit('initCar')
    sock.on('message', (text) => io.emit('message', text, id))
})

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, '172.20.10.4', () => {
    console.log("here we go!")
})