var socket = io();
var body = {{body}}
var style = {{style}}

socket.on("connect", function() {
  socket.emit("roomJoin", "{{key}}");
});

socket.on("message", function(message) {
  updateView(message);
});

function updateView(message) {

}