const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const hostname = '127.0.0.1';
const port = 666;
let socketClients = [];
let message = [];

app.use(express.static('public'));
app.get('/', (req, res) => { res.sendFile('index.html', { root: __dirname }) });

//lien client/serveur

io.on('connection', (socket) => {
    socketClients.push({ id: socket.id });
    socket.emit("init", {
        mail: "bienvenue sur livechat",
        id: socket.id,
        socketClients: socketClients,
        messages:message
    })
    socket.on('initResponse', (initResponse) => {
        socketClients = initResponse.socketClients;
        socket.broadcast.emit('newClients', {
            socketClients: socketClients
        })
    })
    if (socketClients.length > 0) {
        socket.on('disconnect', () => {
            for (let i = 0; i < socketClients.length; i++) {
                if (socketClients[i].id === socket.id) {
                    socketClients.splice(i, 1);
                }
            };
            socket.broadcast.emit('clientDisconnect', {
                socketClients: socketClients
            })
        })
    }
    socket.on('newMsg', (newMsg) => {
        message = newMsg.message;
        socket.broadcast.emit('newMsgResponse', {message: message})
    });
    socket.on('newPrivate',(newPrivate)=>{
        socket.broadcast.to(newPrivate.idContact).emit('privateResponse',{privateResponse:newPrivate});
    })
});

server.listen(port, hostname, () => { console.log(`Server running at http://${hostname}:${port}/`); });