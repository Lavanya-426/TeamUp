module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // attach chat logic
    const chat_socket = require("./chatSocket");
    chat_socket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
