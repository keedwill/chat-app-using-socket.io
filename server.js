const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  getCurrentUser,
  userJoin,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const botname = "Chat Bot";

//initialize
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    //welcome current user
    //emit to the current user
    socket.emit("message", formatMessage(botname, "Welcome to chat cord"));

    //broadcast when a user connects
    //this emits to everybody except the current user that is connecting
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botname, `${user.username} has joined the chat`)
      );
  });

  //listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //runs when a client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      // emit to everyone that the user has left the chat
      io.to(user.room).emit("message", formatMessage(botname, `${user.username} has left the chat`));
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
