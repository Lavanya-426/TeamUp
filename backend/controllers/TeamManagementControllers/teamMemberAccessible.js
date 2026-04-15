const TeamMembership = require("../../models/TeamMembership.js");
const Team = require("../../models/Team.js");

exports.getTeamDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id).populate("created_by", "name email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await TeamMembership.find({
      team_id: id,
    }).populate("user_id", "name email");

    res.json({ members });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
