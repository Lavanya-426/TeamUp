const TeamMembership = require("../../models/TeamMembership.js");
const Team = require("../../models/Team.js");

exports.createTeam = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const team = await Team.create({
      ...req.body,
      created_by: userId,
    });

    await TeamMembership.create({
      user_id: userId,
      team_id: team._id,
      role: "admin",
    });

    res.status(201).json({ team });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    await Team.findByIdAndDelete(id);
    await TeamMembership.deleteMany({ team_id: id });

    res.json({ message: "Team deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndUpdate(id, req.body, { new: true });

    res.json({ team });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
};
