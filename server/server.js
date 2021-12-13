const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const config = require("./config.js")


const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

class Car {
    constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
    }
}

var playerCars = new Map();

io.on('connection', (sock) => {
    const id = Math.trunc(Math.random() * 100000);
    playerCars.set(id,new Car(id));
    io.emit('message', "player " + id + " has connected", id)
    // sock.emit('initCar')
    sock.on('message', (text) => io.emit('message', text, id))
})

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, config.adress, () => {
    console.log("here we go!")
})