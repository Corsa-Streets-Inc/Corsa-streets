const log = (text) => {
    const parent = document.querySelector("#events")
    const el = document.createElement("li")
    el.innerHTML = text;

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

const draw = () => {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(0,0,400,400);
    ctx.fillStyle = "#00000F";
    ctx.fill();
    ctx.closePath(); 
    ctx.beginPath();
    ctx.rect(175, 150, 50, 100);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();    
}


(() => {
    const sock = io();
    draw();
    sock.on('message', log)
    document.querySelector("#chat-form").addEventListener("submit", onChatSubmitted(sock))
})();