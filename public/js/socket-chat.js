var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name')) {
    window.location = "index.html";
    throw new Error("The name is necesary");
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

window.toUser = null;
window.toUsersChat = [];

socket.on('connect', function() {
    socket.emit("getInChat", {
        name: user.name,
        room: user.room
    }, function(resp, toUser) {
        console.log("Usuarios conectados", resp);
        window.toUsersChat = resp.people;
        window.toUser = toUser;
    })
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

/*

-- MANDAR MENSAJE PARA TODOS

socket.emit('sendMessage', {
    model: window.toUser,
    message: "Esta es una prueba xD enviada por " + user.name
}, function(r) {
    console.log("No necesito feedBack", r);
});

-- MANDAR MENSAJE PRIVADO

socket.emit('sendPrivateMessage', {
    model: window.toUser,
    receiver: window.toUsersChat[window.toUsersChat.lenght-1]
    message: "Bienvenido al chat último",
}, function(r) {
    console.log("No necesito feedBack", r);
});

*/

// Escuchar información
socket.on('notificationMsg', function(resp) {

    if (resp && resp.connect == true) {
        window.toUsersChat.push(resp.user);
    } else if (resp && resp.connect == false) {
        window.toUsersChat = window.toUsersChat.filter(p => p.id != resp.user.id);
    }

    console.log(resp.user.name + " - " + resp.message + " - " + new Date(resp.date).toTimeString());

});

//Escuchar información de manera privada
socket.on('messagePrivate', function(resp) {
    console.log("** Mensaje privado de " + resp.user.name + " - " + resp.message + " - " + new Date(resp.date).toTimeString());

});