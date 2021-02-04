//CLIENTE
let socket = io(window.location.origin);

socket.on('cargarDibujos', function(dibujos){
    dibujos.forEach(dibujo => {
        window.whiteboard.draw(dibujo.start, dibujo.end, dibujo.color, false)
    })
    console.log("hola")
})



socket.on('connect', function () {
    console.log('Tengo hecho una conexión persistente bilateral al servidor!');
    
    

});

socket.on("desconectado", function(data){
    console.log(data)
})

window.whiteboard.on("draw", function(start, end, color){
    //console.log([...arguments])
    socket.emit("draw", start, end, color)
    
})

socket.on("elDibujoDeOtro", function(start, end, color){
    console.log(start, end, color)
    window.whiteboard.draw(start, end, color, false)
})