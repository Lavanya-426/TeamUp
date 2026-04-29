const Message = require("../models/Message");

exports.createMessage = async ({ teamId, senderId, text, senderName }) => {
  const message = await Message.create({
    teamId,
    senderId,
    text,
    senderName,
  });

  return message;
};

exports.getMessagesByTeam = async (teamId) => {
  return await Message.find({ teamId }).sort({ createdAt: 1 });
};
