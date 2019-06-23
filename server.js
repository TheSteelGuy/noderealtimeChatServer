var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log("Server running.....");

// using express to serve the html file for browswers
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})

io.sockets.on('connect', (socket)=>{
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length)
    
socket.on('disconnect', (data)=>{
    connections.splice(connections.indexOf(socket),1);
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames()
    console.log(users)
    console.log('Disconnected: %s sockets connected', connections.length)
})
socket.on('send message', function(data){
    console.log(data)
    io.sockets.emit('new message', {msg:data, username:socket.username})
});

socket.on('new user', (username, callback)=>{
    callback(username)
    socket.username = username;
    users.push(username)
    console.log(users)
    updateUsernames()
});
// ES6 function definition
const updateUsernames = ()=>{
    io.sockets.emit('get users', users)
}

})