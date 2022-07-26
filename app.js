const express = require('express'); 
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const hostname = '127.0.0.1';
const port = 666;


app.use(express.static('public'));
app.get('/', (req, res) => {res.sendFile('index.html',{root:__dirname})});

//lien client/serveur


io.on("connexion", (socket)=>{
    console.dir(socket);
    socket.emit("init",{
        message: "bienvenue sur livechat",
        id: socket.id,
    })
});






server.listen(port, hostname, () => {console.log(`Server running at http://${hostname}:${port}/`);});