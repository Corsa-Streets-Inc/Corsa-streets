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

    var cars = {}

    const updateMap = (newCars) => {
        cars = newCars;
    }

    const skin1 = () => {
        ctx.translate(-10, -25)
        ctx.rect(0, 0, carWidth, carLength);
        ctx.fill();

    }

    const skin2 = () => {
        
        ctx.translate(-10, -25)
        ctx.fillRect(0, 0, carWidth, carLength);
        ctx.fillRect(-5, 5, carWidth, carLength/2);
        ctx.fillStyle = "black";
        ctx.fillRect(5, 5, 15, 10);
        ctx.fillRect(5, 35, 10, 15);

    }

    

    const drawCar = (x = -10, y = -25, a = 0, color = 'red', wok = false, sus = true) => {
        
        ctx.beginPath();
        ctx.save();
        ctx.translate(x+10, y+25)
        ctx.rotate(a);
        ctx.fillStyle = color;

        if(sus){
            skin2();
        }  
        else{
            skin1();
        }

        ctx.restore();
        ctx.closePath();  

        if(wok) {
            drawFire(x, y);
        }
    }

    var fire = new Image()
    var i = 0;
    const drawFire = (x, y, a = 0) => {
        fire.src = "../imgs/wog/"+Math.trunc(i/20)+".png";
        ctx.beginPath();
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(0.3, 0.3);
        ctx.drawImage(fire, 0, 0);
        ctx.restore()
        ctx.closePath();  
        i+=2;
        i%=300;
    }

    const drawCars = () => {
        ctx.fillStyle = "#00000F";
        ctx.fillRect(0,0,400,400);
        for (var [id, car] of Object.entries(cars)) {
            drawCar(car.x, car.y, car.a, car.color, car.wok, car.sus)
        }
    }


    return {drawCars, updateMap, drawFire}
}

const control = (sock) => {
    document.addEventListener('keydown', (e) => {
        if(e.keyCode == 39) {
            sock.emit('command', 'rotate', "right")
        }
        if (e.keyCode == 37) {
            sock.emit('command', 'rotate', "left")
        }
        if(e.keyCode == 38) {
            sock.emit('command', 'move', "forvard");
        }
        if (e.keyCode == 40){
            sock.emit('command', 'move', "backward")
        }
        if (e.key == "m"){
            sock.emit('wok')
        }
        if (e.key == "s"){
            sock.emit('sus')
        }
    })
    document.addEventListener('keyup', (e) => {
        if(e.keyCode == 39) {
            sock.emit('command', 'rotate', "stop")
        }
        if (e.keyCode == 37) {
            sock.emit('command', 'rotate', "stop")
        }
        if(e.keyCode == 38) {
            sock.emit('command', 'move', "stop");
        }
        if (e.keyCode == 40){
            sock.emit('command', 'move', "stop")
        }
    })

}

(() => {
    const sock = io();
    var canvas = document.getElementById("canvas");
    const {drawCars, updateMap, drawFire} =  drawGame(canvas);

    setInterval(drawCars, 10)

    control(sock);

    sock.on('map', updateMap)

    sock.on('message', log)
    document.querySelector("#chat-form").addEventListener("submit", onChatSubmitted(sock))
})();