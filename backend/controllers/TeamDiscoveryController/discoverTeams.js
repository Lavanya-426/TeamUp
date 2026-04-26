const Team = require("../../models/Team");
const TeamMembership = require("../../models/TeamMembership");
const isSameProject = require("../../utils/projectIdentifierUtils");
const getRequestStatus = require("../../utils/getRequestStatus");

exports.discoverTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const scope = req.body.scope;

    const existing = await TeamMembership.findOne({ user_id: userId, scope });
    if (existing) {
      return res.status(400).json({
        message: `You already a part of a team for this ${req.body.type}`,
      });
    }

    const teams = await Team.aggregate([
      {
        $match: {
          scope,
          status: "OPEN",
        },
      },
      {
        $addFields: {
          urgencyRank: {
            $switch: {
              branches: [
                { case: { $eq: ["$urgency", "urgent"] }, then: 1 },
                { case: { $eq: ["$urgency", "moderate"] }, then: 2 },
                { case: { $eq: ["$urgency", "mild"] }, then: 3 },
              ],
              default: 4,
            },
          },
          spotsLeft: { $subtract: ["$max_members", "$current_members"] },
        },
      },
      {
        $sort: {
          deadline: 1, // earliest deadline first
          urgencyRank: 1, // urgent first
          spotsLeft: -1, // more spots left first
        },
      },
    ]);
    teams.forEach((team) => {
      team.canRequest = getRequestStatus(team._id, userId);
    });
    res.json({ teams });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
