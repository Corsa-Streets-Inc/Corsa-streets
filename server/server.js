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
        this.move = 0;
        this.rotate = 0;
    }
}

var playerCars = {};

setInterval(() => {
    var carSpeed = 2;
    var carRotateSpeed = Math.PI / 60;
    for (var [id, car] of Object.entries(playerCars)) {
        car.y += Math.sin(car.a - Math.PI/2)*car.move*carSpeed;
        car.x += Math.cos(car.a - Math.PI/2)*car.move*carSpeed;
        car.a += car.rotate*carRotateSpeed;
        playerCars[id] = car;
    }
    io.emit('map', playerCars);
}, 10);


io.on('connection', (sock) => {
    const id = Math.trunc(Math.random() * 100000);
    io.emit('message', "player " + id + " has connected", id)

    playerCars[id] = new Car(id);

    console.log(playerCars);
    io.emit('map', playerCars);

    sock.on('command', (command, direction) => {
        var car = playerCars[id]
        if (command == 'move') {
            if(direction == "forvard"){
                car.move = -1;
            } 
            else if(direction == "backward"){
                car.move = 1;
            }
            else if(direction == "stop"){
                car.move = 0;
            }
        }
        if(command == 'rotate') {
            if(direction == "left"){
                car.rotate = -1;
            } 
            else if(direction == "right"){
                car.rotate = 1;
            }
            else if(direction == "stop"){
                car.rotate = 0;
            }


        }
        playerCars[id] = car;


    })

    sock.on('message', (text) => io.emit('message', text, id))


})

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, config.adress, () => {
    console.log("here we go!")
})
