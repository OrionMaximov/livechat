const socket = io();

 console.log("yoda");
 
socket.on("init", (init) => {
    console.log(init.message); 
    console.log(init.id); 
});