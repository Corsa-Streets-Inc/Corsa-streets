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

const drawGame = (sock) => {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var x = -10, y = -25, a = 0; 

    const drawCar = () => {
        ctx.beginPath();
        ctx.rect(0,0,400,400);
        ctx.fillStyle = "#00000F";
        ctx.fill();
        ctx.closePath(); 
        ctx.beginPath();
        ctx.save();
        ctx.translate(200, 200)
        ctx.rotate(a);
        ctx.rect(x, y, 20, 50);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.restore();
        ctx.closePath();    
    }
    setInterval(drawCar, 100)

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
    drawGame(sock);
    control(sock);
    sock.on('message', log)
    document.querySelector("#chat-form").addEventListener("submit", onChatSubmitted(sock))
})();