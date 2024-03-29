const httpServer = require("http").createServer();
const PORT = process.env.PORT || 8000;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  /**fetch existing orders */
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  /**notify existing users */
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  /**forword the private message to the right recipient */
  socket.on("private massage", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
  /**notify the users upon disconnection */
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

httpServer.listen(PORT, () =>
  console.log(`server listening at http://loaclhost:${PORT}`)
);
