const Message = require("../models/Message");

exports.createMessage = async ({ teamId, senderId, text }) => {
  const message = await Message.create({
    teamId,
    senderId,
    text,
  });

  return message;
};

exports.getMessagesByTeam = async (teamId) => {
  return await Message.find({ teamId }).sort({ createdAt: 1 });
};
