const socket = io();  
let monSocketClients=[];


socket.on("init",(init)=>{    
    const monId = init.id;
   monSocketClients = init.socketClients;
    const pseudo = prompt("Je suis pas venu ici pour souffrir OK?");
    for(let i =0; i< monSocketClients.length;i++) {
        if(monSocketClients[i].id === monId){
            monSocketClients[i].pseudo=pseudo
        }
    }; 
    socket.emit('initResponse',{
        socketClients:monSocketClients,  
    })
   
});
socket.on('clientDisconnect',(clientDisconnec)=>{
    monSocketClients=clientDisconnec.socketClients;
    console.dir(monSocketClients);
})