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

const dibujos = {}
//const users = {}

let conexion = io.on('connection', function (socket) {
    /* Esta función recibe la nueva conexión socket. Esta función 
       va a ser llamada para cada browser que se conecta a nuestro 
       servidor. 
    */
    
    socket.join(this.sala);
    let sala = (this.sala)
 

    if(dibujos[sala]){
        io.to(sala).emit('cargarDibujos', dibujos[sala])
    }


    console.log(`Un nuevo cliente se ha conectado! id:${socket.id}`);
    console.log(socket.handshake.headers.referer)
    
    socket.on('disconnect', function(){
        console.log("un usuario se desconectó")
        io.to(sala).emit("desconectado", `Un usuario se desconectó, id: ${socket.id}`)
    })

    socket.on('draw', function(start, end, color){
        if(color == null) color = "black"
        if(!dibujos[sala]) dibujos[sala] = []
        dibujos[sala].push({start, end, color})
        socket.to(sala).emit("elDibujoDeOtro", start, end, color);
        
    })
});


app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, 'index.html'));
    res.redirect('/sala1')
});

app.get('/:sala', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
    let sala = req.params.sala
    conexion.sala = sala
    
});

