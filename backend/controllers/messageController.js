const messageService = require("../services/messageService");
const TeamMembership = require("../models/TeamMembership");
exports.getTeamMessages = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { teamId } = req.params;
    const membership = await TeamMembership.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (!membership) {
      return res.status(403).json({ message: "not a member of this team" });
    }

    const messages = await messageService.getMessagesByTeam(teamId);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
