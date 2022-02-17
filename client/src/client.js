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
    var cars = {}
    var mapData;
    var backgroundColor;
    const updateMap = (newCars, newMapData) => {
        cars = newCars;
        mapData = newMapData;
        backgroundColor = mapData.time == 0 ? "#00000F" : "white";
    }

    const drawBackGround = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    const drawCarElements = (car) =>{

        var carWidth = car.width;
        var carLength = car.length;
        var headlightLength = car.headlightLength;
        var headlightWidth = car.headlightWidth;

        var tiretrackColor = mapData.time == 0 ? "white" : "black";

        
        const skin1 = () => {
            ctx.translate(-10, -25)
            ctx.rect(0, 0, carWidth, carLength);
            ctx.fill();
            ctx.fillStyle = "yellow";
            ctx.fillRect(2,2,headlightWidth,headlightLength);
            ctx.fillRect(13,2,headlightWidth,headlightLength);
        }

        const skin2 = () => {
            
            ctx.translate(-10, -25)
            ctx.fillRect(0, 0, carWidth, carLength);
            ctx.fillRect(-5, 5, carWidth, carLength/2);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(5, 5, 15, 10);
            ctx.fillRect(5, 35, 10, 15);

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

        var track = car.tireTrack;
        const drawTrack = () => {
            for(tPair of track){            
                ctx.beginPath();
                ctx.fillStyle = tiretrackColor;
                ctx.arc(tPair.x1, tPair.y1, 1, 0, 2*Math.PI)
                ctx.arc(tPair.x2, tPair.y2, 1, 0, 2*Math.PI)
                ctx.fill();
                ctx.closePath();
            }
        }

        return {skin1, skin2, drawFire, drawTrack}
    }
    
    

    const drawCar = (car) => {
        const {skin1, skin2, drawFire, drawTrack} = drawCarElements(car);
        drawTrack();
        ctx.beginPath();
        ctx.save();
        ctx.translate(car.centreX, car.centreY)
        ctx.rotate(car.a);
        ctx.fillStyle = car.color;


        if(car.sus){
            skin2();
        }  
        else{
            skin1();
        }

        ctx.restore();
        ctx.closePath();  



        if(car.wok) {
           drawFire(car.x, car.y);
        }

    }

    

    const drawCars = () => {
        drawBackGround();
        for (var [id, car] of Object.entries(cars)) {
            drawCar(car)
        }
    }


    return {drawCars, updateMap}
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
            sock.emit('command', 'move', "forward");
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
    const {drawCars, updateMap} =  drawGame(canvas);

    setInterval(drawCars, 30)

    control(sock);

    sock.on('map', updateMap)

    sock.on('message', log)
    document.querySelector("#chat-form").addEventListener("submit", onChatSubmitted(sock))
})();