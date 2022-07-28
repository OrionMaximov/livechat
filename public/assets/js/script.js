const socket = io();
let monSocketClients = [];
let monMsg = [];
let monId;
const clients = document.getElementById('clients');
const msg = document.getElementById('msg');
const private = document.getElementById("private");
const sendP = document.getElementById('sendP');
const answerPrivate = document.getElementById('answerPrivate');
const innerAnswer = document.getElementById('innerAnswer');
const closeAnswer = document.getElementById('closeAnswer');
const closePrivate = document.getElementById('closePrivate');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pseudo = urlParams.get('pseudo');

function displayClients(monSocketClients) {
    let clientsTmp = "";
    monSocketClients.forEach(element => {
        if(monId !== element.id){
        clientsTmp += `<div onClick="privateMessage('${element.id}');">${element.pseudo}</div>`}
    });
    clients.innerHTML = clientsTmp;
};

function privateMessage(idContact) {
    private.classList.toggle('hide');
    private.classList.toggle('show');
    console.log(idContact);
    sendP.addEventListener("click", () => {
        let msg = tinyMCE.get('mP').getContent();
        let date = new Date;
        tinyMCE.activeEditor.setContent('');
        socket.emit('newPrivate', {
            id: monId,
            idContact: idContact,
            pseudo: pseudo,
            newMessage: msg,
            date: [
                date.getDate() + ":" + (date.getMonth() + 1) + ":" + date.getFullYear() + "/" + date.toLocaleTimeString()
            ],
        })
        private.classList.add('hide');
        private.classList.remove('show');
    })
    closePrivate.addEventListener("click", () => {
        private.classList.add('hide');
        private.classList.remove('show');


    })
};

function displayMsg(monMsg) {
    let msgTmp = "";
    monMsg.forEach(element => {
        msgTmp += `<div class='flex'>
        <div>${element.pseudo}</div>
                     <div>${element.message}</div> 
                     <div>${element.date}</div>
                     </div>`;
    });
    msg.innerHTML = msgTmp;
};

socket.on("init", (init) => {
    monId = init.id;
    monSocketClients = init.socketClients;
    monMsg = init.messages;
    if (pseudo === null || pseudo === "") {
        window.location.href = 'http://127.0.0.1:666/'
    }
    for (let i = 0; i < monSocketClients.length; i++) {
        if (monSocketClients[i].id === monId) {
            monSocketClients[i].pseudo = pseudo
        }
    };
    socket.emit('initResponse', {
        socketClients: monSocketClients,
    })
    displayClients(monSocketClients);
    displayMsg(monMsg);
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

tinymce.init({
    selector: '#mytextarea',
    menubar: false,
    insertdatetime_formats: [
        "%A %d-%m-%Y",
    ],
    plugins: [
        'emoticons', 'insertdatetime'
    ],
    toolbar: 'emoticons bold italic backcolor  insertdatetime',
});

tinymce.init({
    selector: '#mP',
    menubar: false,
    insertdatetime_formats: [
        "%A %d-%m-%Y",
    ],
    plugins: [
        'emoticons', 'insertdatetime'
    ],
    toolbar: 'emoticons bold italic backcolor  insertdatetime',
});

document.getElementById("sendMsg").addEventListener("click", () => {
    displayMsg(monMsg);
    let msg = tinyMCE.get('mytextarea').getContent();
    let date = new Date;

    monMsg.push({
        id: monId,
        pseudo: pseudo,
        message: msg,
        date: [
            date.getDate() + ":" + (date.getMonth() + 1) + ":" + date.getFullYear() + "/" + date.toLocaleTimeString()
        ],
    });
    console.dir(monMsg);
    socket.emit('newMsg', { message: monMsg });
    displayMsg(monMsg);
    tinyMCE.activeEditor.setContent('');
});

socket.on("newMsgResponse", (newMsgResponse) => {
    monMsg = newMsgResponse.message;
    displayMsg(monMsg);
});

socket.on("privateResponse", (privateResponse) => {
    console.dir(privateResponse);
    answerPrivate.classList.remove('hide');
    answerPrivate.classList.add('show');
    for (const [key, value] of Object.entries(privateResponse)) {
        let pseudo = value.pseudo;
        let message = value.newMessage;
        let date = value.date;
        let responseCard = document.createElement('div');
        responseCard.classList.add("card");
        responseCard.innerHTML = pseudo + '<br>' + message + '<br>' + date + '<br>';
        innerAnswer.append(responseCard);
        closeAnswer.addEventListener("click", () => {
            responseCard.remove();
            answerPrivate.classList.add('hide');
            answerPrivate.classList.remove('show');
        })
        answerPrivate.addEventListener("click", (e) => {
            if (!responseCard.contains(e.target)) {
                responseCard.remove();
                answerPrivate.classList.toggle('hide');
                answerPrivate.classList.toggle('show');
            }
        })
        innerAnswer.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
        })
    }
   
});