const Team = require("../../models/Team");
const TeamMembership = require("../../models/TeamMembership");
const TeamJoinRequest = require("../../models/Request");

exports.discoverTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const scope = req.body.scope;

    // If already in a team for this scope → block
    const existingMembership = await TeamMembership.findOne({
      user_id: userId,
      scope,
    });

    if (existingMembership) {
      return res.status(400).json({
        message: `You are already part of a team for this ${req.body.type}`,
      });
    }

    // Fetch all OPEN teams in this scope
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
          spotsLeft: {
            $subtract: ["$max_members", "$current_members"],
          },
        },
      },
      {
        $sort: {
          deadline: 1,
          urgencyRank: 1,
          spotsLeft: -1,
        },
      },
    ]);

    // Fetch ALL pending requests of this user (ONLY ONCE)
    const requests = await TeamJoinRequest.find({
      user_id: userId,
      status: "pending",
    })
      .select("team_id")
      .lean();

    // Convert to Set for O(1) lookup
    const requestedTeamIds = new Set(requests.map((r) => String(r.team_id)));

    //  Attach canRequest field
    const teamsWithStatus = teams.map((team) => ({
      ...team,
      canRequest: requestedTeamIds.has(String(team._id)) ? "pending" : "none",
    }));

    return res.json({ teams: teamsWithStatus });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
