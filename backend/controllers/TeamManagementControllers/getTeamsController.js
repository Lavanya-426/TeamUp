const TeamMembership = require("../../models/TeamMembership.js");
const Team = require("../../models/Team.js");

exports.getAdminTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const memberships = await TeamMembership.find({
      user_id: userId,
      role: "admin",
    }).populate("team_id");

    const teams = memberships.map((m) => m.team_id);

    res.json({ teams });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
};

exports.getMemberTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const memberships = await TeamMembership.find({
      user_id: userId,
      role: "member",
    }).populate("team_id");

    const teams = memberships.map((m) => m.team_id);

    res.json({ teams });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const memberships = await TeamMembership.find({
      user_id: userId,
    }).populate("team_id");

    const teams = memberships.map((m) => m.team_id);

    res.json({ teams });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
};
