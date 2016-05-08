var io;
function init(http) {
  io = require("socket.io")(http);
  addListener();
}

module.exports = init;

function addListener() {
  io.on("connection", function(socket) {
    socket.on("roomJoin", function(room) {
      console.log("joining room:", room)
      socket.room = room;
      socket.join(room);
    });
    socket.on("message", function(message) {
      console.log("Sending message from %s, to room %s", socket.id, socket.room);
      socket.broadcast.to(socket.room).emit("message", message);
    });
  })
}