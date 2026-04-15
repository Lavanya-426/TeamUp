const TeamMembership = require("../../models/TeamMembership.js");
const joinRequest = require("../../models/Request.js");

exports.viewReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // 1. find teams where user is admin
    const adminTeams = await TeamMembership.find({
      student_id: userId,
      role: "admin",
    }).select("team_id");

    const teamIds = adminTeams.map((t) => t.team_id);

    // 2. get all pending requests for those teams
    const requests = await TeamJoinRequest.find({
      team_id: { $in: teamIds },
      status: "pending",
    });

    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.viewSentRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const requests = await joinRequest.find({
      student_id: userId,
    });

    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
