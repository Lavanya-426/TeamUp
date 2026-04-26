const messageService = require("../services/messageService");

exports.getTeamMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const messages = await messageService.getMessagesByTeam(teamId);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
