var path = require('path');
var express = require('express');
var socketio = require('socket.io');
var app = express();


// app.listen() returns an http.Server object
// http://expressjs.com/en/4x/api.html#app.listen
var server = app.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

const io = socketio(server);

const dibujos = []

io.on('connection', function (socket) {
    /* Esta función recibe la nueva conexión socket. Esta función 
       va a ser llamada para cada browser que se conecta a nuestro 
       servidor. 
    */
    if(dibujos.length){
        io.emit('cargarDibujos', dibujos)
    }


    console.log(`Un nuevo cliente se ha conectado! id:${socket.id}`);
    console.log(socket)
    
    socket.on('disconnect', function(){
        console.log("un usuario se desconectó")
        io.emit("desconectado", `Un usuario se desconectó, id: ${socket.id}`)
    })

    socket.on('draw', function(start, end, color){
        if(color == null) color = "black"
        dibujos.push({start, end, color})
        console.log(start, end, color)
        socket.broadcast.emit("elDibujoDeOtro", start, end, color);
    })
    
});


app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/sala1', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

