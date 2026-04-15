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
    }).sort({ createdAt: -1 }); // newest first;

    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.viewSentRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const requests = await TeamJoinRequest.aggregate([
      { $match: { student_id: userId } },

      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "accepted"] }, then: 2 },
                { case: { $eq: ["$status", "rejected"] }, then: 3 },
                { case: { $eq: ["$status", "withdrawn"] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      },

      { $sort: { statusPriority: 1, createdAt: -1 } },
    ]);
    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
