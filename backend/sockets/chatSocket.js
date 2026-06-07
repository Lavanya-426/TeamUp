const messageService = require("../services/messageService");
const TeamMembership = require("../models/TeamMembership");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = (io, socket) => {
  // join team room

  // send message

  socket.on("send_message", async ({ teamId, text, clientMsgId }, ack) => {
    try {
      const senderId = socket.user.id;

      if (!teamId || !text) {
        return ack?.({
          ok: false,
          code: "BAD_REQUEST",
          message: "teamId and text are required",
          clientMsgId,
        });
      }

      // Authorization: user must be a member of this team
      const membership = await TeamMembership.findOne({
        user_id: senderId,
        team_id: teamId,
      });

      if (!membership) {
        return ack?.({
          ok: false,
          code: "FORBIDDEN",
          message: "Not a member of this team",
          clientMsgId,
        });
      }

      const user = await User.findById(senderId).select("name");
      if (!user) {
        return ack?.({
          ok: false,
          code: "USER_NOT_FOUND",
          message: "User not found",
          clientMsgId,
        });
      }

      const message = await messageService.createMessage({
        teamId,
        senderId,
        senderName: user.name,
        text: text,
      });
      console.log("MESSAGE CREATED:", message.createdAt, "TEAM:", teamId);

      io.to(`team_${teamId}`).emit("receive_message", message);

      return ack?.({
        ok: true,
        messageId: message._id,
        clientMsgId,
        serverTimestamp: message.createdAt,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      return ack?.({
        ok: false,
        code: "SEND_FAILED",
        message: "Failed to send message",
      });
    }
  });

  socket.on("join_team", async ({ teamId }) => {
    try {
      const userId = socket.user.id;
      socket.join(`team_${teamId}`);
      console.log("JOIN TEAM EMITTED");
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

  socket.on("leave_team", ({ teamId }) => {
    socket.leave(`team_${teamId}`);
    console.log(`User ${socket.id} left team ${teamId}`);
  });
  // mark seen explicitly
  socket.on("mark_seen", async ({ teamId }) => {
    try {
      const userId = socket.user.id;

      await TeamMembership.findOneAndUpdate(
        { user_id: userId, team_id: teamId },
        { lastSeenAt: new Date() },
      );
    } catch (err) {
      console.log("Seen error:", err);
    }
  });
};
