const messageService = require("../services/messageService");
const TeamMembership = require("../models/TeamMembership");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = (io, socket) => {
  // join team room

  // send message
  socket.on("send_message", async (data) => {
    try {
      const { teamId, token, text } = data;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const senderId = decoded.id;

      // FETCH USER NAME
      const user = await User.findById(senderId).select("name");
      console.log("User found:", user);
      if (!user) {
        console.log("User not found");
        return;
      }

      // SAVE MESSAGE WITH NAME
      const message = await messageService.createMessage({
        teamId,
        senderId,
        senderName: user.name,
        text,
      });

      io.to(`team_${teamId}`).emit("receive_message", message);
      console.log(`Message sent to team_${teamId}:`, message);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("join_team", async ({ teamId, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      socket.join(`team_${teamId}`);

      // mark as seen when joining
      await TeamMembership.findOneAndUpdate(
        { user_id: userId, team_id: teamId },
        { lastSeenAt: new Date() },
      );

      console.log(`User ${userId} joined team ${teamId}`);
    } catch (err) {
      console.log("Join error:", err);
    }
  });

  // mark seen explicitly
  socket.on("mark_seen", async ({ teamId, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      await TeamMembership.findOneAndUpdate(
        { user_id: userId, team_id: teamId },
        { lastSeenAt: new Date() },
      );
    } catch (err) {
      console.log("Seen error:", err);
    }
  });
};
