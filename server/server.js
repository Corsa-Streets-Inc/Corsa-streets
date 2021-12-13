const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
let car = {
    x:0,
    y:0
}
var playerCars = new Map();

io.on('connection', (sock) => {
    const id = Math.trunc(Math.random() * 100000);
    playerCars.set(id,new car);
    io.emit('message', "player " + id + " has connected", id)
    // sock.emit('initCar')
    sock.on('message', (text) => io.emit('message', text, id))
})

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, '25.77.209.239', () => {
    console.log("here we go!")
})