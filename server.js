const path = require('path')
const express = require('express');
const http = require('http')
const socketio = require('socket.io');
const formatmessage = require('./utils/messages.js')
const {userjoin,getcurrentuser,userleave,getroomuser} = require('./utils/users.js')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose')

//set static folder
app.use(express.static(path.join(__dirname,'public')))


const botname = 'chatcord bot';
//run when client connects

io.on('connection', socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user = userjoin(socket.id,username,room);

        socket.join(user.room)
        //welcome current user
        socket.emit('message',formatmessage(botname,'welcome tot the chatcord'));

        //broadcasts when a user connects
        socket.broadcast.to(user.room).emit('message',
            formatmessage(botname,`${user.username} joined the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getroomuser(user.room)
        })

    });
    //listen for chatmessage
    socket.on('chatmessage', (msg) => {
        const user = getcurrentuser(socket.id);

        console.log("Received on server:", msg);
        io.to(user.room).emit('message',
            formatmessage(user.username, msg));
    });

    //runs when clients disconnect
    socket.on('disconnect',()=>{
        const user = userleave(socket.id);
        if(user){
            console.log(`${user.username} has left the chat`)
            io.to(user.room).emit('message',
                formatmessage(botname, `${user.username} left the chat`));
                //send users and room info
                io.to(user.room).emit('roomUsers',{
                    room:user.room,
                    users:getroomuser(user.room)
                })
        }

    })
})

const port = process.env.PORT || 3000;
server.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
    
})