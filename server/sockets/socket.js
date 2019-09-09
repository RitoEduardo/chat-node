const { io } = require('../server');
const { Users } = require('../classes/users')

const { createMsg } = require('../utils')

const users = new Users();

io.on('connection', (client) => {

    client.on('getInChat', (data, callback) => {

        if (!data.name) {
            return callback({
                success: false,
                message: "The name is necesary"
            })
        }

        let people = users.addUser(client.id, data.name);
        let myUser = users.getUser(client.id);

        if (data.room) {
            client.join(data.room);
            users.addRoomPerson(client.id, data.room);
        }

        //client.broadcast.emit('notificationMsg', createMsg(myUser, "Se unio al chat"));
        var temp = createMsg(myUser, "Se unio al la sala " + data.room);
        temp.connect = true;
        client.broadcast.to(data.room).emit('notificationMsg', temp);

        //client.broadcast.to(data.room).emit('notificationPrivateRoom', createMsg(myUser,"Se unio a la sala privada"))

        return callback({
            success: true,
            people: data.room ? users.getUserForRoom(data.room) : people,
            message: "Add the chat",
        }, myUser);

    });

    /*
    client.on('sendMessage', (data, callback) => {
        if (!data.model || !data.model.id) {
            callback({
                success: false,
                error: "The Model is necesary for ID",
                data
            });
        }
        client.broadcast.emit('notificationMsg', createMsg(users.getUser(data.model.id), data.message));
    });
    */

    //Mensajes para todos
    client.on('sendMessage', (data, callback) => {
        if (!data.message) {
            return callback({
                success: false,
                error: "The Message is necesary",
                data
            });
        }
        let sendMsg = createMsg(users.getUser(client.id), data.message);
        client.broadcast.emit('notificationMsg', sendMsg);
        callback({
            success: true,
            message: "OK",
            response: sendMsg
        });
    });

    client.on('sendMessageForRoom', (data) => {
        if (data.room) {
            client.broadcast.to(data.room).emit('notificationMsg', createMsg(users.getUser(client.id), data.message));
        }
    });

    //Mensaje privado
    client.on('sendPrivateMessage', (data, callback) => {

        if (data.receiver && data.message) {
            console.log("Mesage private to " + data.receiver.id);
            client.broadcast.to(data.receiver.id).emit('messagePrivate', createMsg(users.getUser(client.id), data.message));
        } else {
            callback({
                success: false,
                error: "Is necesary know the receiver and message",
                data
            });
        }


    });

    client.on('disconnect', () => {
        let user = users.deleteUser(client.id);
        //client.broadcast.emit('notificationMsg', createMsg(user, "Abandono el chat"));
        user.rooms.forEach((item) => {
            console.log(item)
            var temp = createMsg(user, "Abandono la sala " + item, false);
            temp.connect = false;
            client.broadcast.to(item).emit('notificationMsg', temp);
        });
    });

});