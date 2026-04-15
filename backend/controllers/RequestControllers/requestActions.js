const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");
const updateTeamStats = require("../../utils/teamUtils.js");

exports.approveRequest = async (req, res) => {
  try {
    const { teamId } = req.params;
    const request = req.requestDoc;
    const team = req.targetTeam;

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (request.team_id.toString() !== teamId) {
      return res.status(400).json({ message: "Team mismatch" });
    }

    // team full check
    if (team.current_members >= team.max_members) {
      return res.status(400).json({ message: "Team is full" });
    }

    const exists = await TeamMembership.findOne({
      user_id: request.user_id,
      team_id: teamId,
    });

    if (!exists) {
      await TeamMembership.create({
        user_id: request.user_id,
        team_id: teamId,
        role: "member",
      });
    }

    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    await updateTeamStats(teamId);

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId, teamId } = req.params;

    const request = await TeamJoinRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    // SECURITY CHECK
    if (request.team_id.toString() !== teamId) {
      return res.status(400).json({ message: "Team mismatch" });
    }

    request.status = "rejected";
    request.respondedAt = new Date();
    await request.save();

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
