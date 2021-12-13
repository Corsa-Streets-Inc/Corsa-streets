const log = (text, id) => {
    const parent = document.querySelector("#events")
    const el = document.createElement("li")
    el.innerHTML = id + ': ' + text;

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight
}

const onChatSubmitted = (sock) => (e) => {
    e.preventDefault();

    const input = document.querySelector("#chat")
    const text = input.value
    input.value = ''

    sock.emit('message', text)
}

const drawGame = (canvas) => {
    var ctx = canvas.getContext("2d");

    var carWidth = 20, carLength = 50;

    var cars = []

    const updateMap = (newCars) => {
        cars = newCars;
    }

    const drawCar = (x = -10, y = -25, a = 0, color = 'red') => {
        
        ctx.fillStyle = "#00000F";
        ctx.fillRect(0,0,400,400);
        ctx.beginPath();
        ctx.save();
        ctx.translate(200, 200)
        ctx.rotate(a);
        ctx.rect(x, y, carWidth, carLength);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
        ctx.closePath();    
    }

    const drawCars = () => {
        for (var car in cars) {
            drawCar(car.x, car.y, car.a, car.color)
        }
    }

    //setInterval(drawCar, 100)
    return {drawCars, updateMap}
}

const control = (sock) => {
    document.addEventListener('keydown', (e) => {
        if(e.keyCode == 39) {
            sock.emit('command', 'rotate', Math.PI / 60)
        }
        else if (e.keyCode == 37) {
            sock.emit('command', 'rotate', -Math.PI / 60)
        }
        else if(e.keyCode == 38) {
            sock.emit('command', 'move', 2)
        }
        else if (e.keyCode == 40){
            sock.emit('command', 'move', -2)
        }
    })
}

(() => {
    const sock = io();
    var canvas = document.getElementById("canvas");
    const {drawCars, updateMap} =  drawGame(canvas);

    drawCars()
    control(sock);

    sock.on('map', updateMap)

    sock.on('message', log)
    document.querySelector("#chat-form").addEventListener("submit", onChatSubmitted(sock))
})();