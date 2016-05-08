var socket = io();

socket.on("connect", function() {
  socket.emit("roomJoin", {{key}});
});

socket.on("message", function(message) {
  updateView(message);
});

function updateView(message) {

}