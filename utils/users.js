const users =[];


//join to user chat

function userjoin(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

//Get the Current User

function getcurrentuser(id){
    return users.find(user => user.id === id);
}

//user leaves on chat

function userleave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !==-1){
        return users.splice(index,1)[0];
    }
}
function getroomuser(room){
    return users.filter(user => user.room ===room);
}

module.exports = {
    userjoin,
    getcurrentuser,
    userleave,
    getroomuser
}