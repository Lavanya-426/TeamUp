const messageService = require("../services/messageService");
const jwt = require("jsonwebtoken");
module.exports = (io, socket) => {
  // join team room
  socket.on("join_team", (teamId) => {
    socket.join(`team_${teamId}`);
    console.log(`Socket ${socket.id} joined team_${teamId}`);
  });

  // send message
  socket.on("send_message", async (data) => {
    try {
      const { teamId, token, text } = data;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const senderId = decoded.id;
      // save message to DB
      const message = await messageService.createMessage({
        teamId,
        senderId,
        text,
      });

      // emit to team room
      io.to(`team_${teamId}`).emit("receive_message", message);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });
};
