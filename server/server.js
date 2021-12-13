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
        this.a = 0;
        this.color = "red";
    }
}

var playerCars = {};


io.on('connection', (sock) => {
    const id = Math.trunc(Math.random() * 100000);
    io.emit('message', "player " + id + " has connected", id)

    playerCars[id] = new Car(id);

    console.log(playerCars);
    io.emit('map', playerCars);

    sock.on('command', (command, value) => {
        var car = playerCars[id]
        if (command == 'move') {
            car.y += Math.sin(car.a - Math.PI/2)*value;
            car.x += Math.cos(car.a - Math.PI/2)*value;
        }
        else if(command == 'rotate') {
            car.a += value;
        }
        playerCars[id] = car;

        io.emit('map', playerCars)
    })
    sock.on('message', (text) => io.emit('message', text, id))
})

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, config.adress, () => {
    console.log("here we go!")
})