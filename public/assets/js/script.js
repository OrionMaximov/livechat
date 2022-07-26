const socket = io();
let monSocketClients = [];
const clients = document.getElementById('clients');

function displayClients(monSocketClients) {
    let clientsTmp = "";
    monSocketClients.forEach(element => {
        clientsTmp += element.pseudo + "<br>";
    });
    clients.innerHTML = clientsTmp;
};

socket.on("init", (init) => {
    const monId = init.id;
    monSocketClients = init.socketClients;
    const pseudo = prompt("Je suis pas venu ici pour souffrir OK?");
    for (let i = 0; i < monSocketClients.length; i++) {
        if (monSocketClients[i].id === monId) {
            monSocketClients[i].pseudo = pseudo
        }
    };
    socket.emit('initResponse', {
        socketClients: monSocketClients,
    })
    displayClients(monSocketClients);
});
socket.on('newClients', (newClients) => {
    monSocketClients = newClients.socketClients;
    console.dir(monSocketClients);
    displayClients(monSocketClients);
});
socket.on('clientDisconnect', (clientDisconnect) => {
    monSocketClients = clientDisconnect.socketClients;
    console.dir(monSocketClients);
    displayClients(monSocketClients);
});
