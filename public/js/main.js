const chatform = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomname  = document.getElementById('room-name')
const userList = document.getElementById('users')


const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

const socket = io();

//join chatroom
socket.emit('joinRoom',{username,room})

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputroomname(room),
    outputusers(users)
})


// console.log(username, room)
//message from server
socket.on('message',message =>{
    console.log(message);
    outputmessage(message);


    //scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    
    //get message text
    const msg = e.target.elements.msg.value;

    
    // console.log(msg)

    //emit message to server
    socket.emit('chatmessage',msg)

    //clear input
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
})


//output message to DOM
function outputmessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputroomname(room){
    roomname.innerText = room;
}

function outputusers(users) {
    userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
}
