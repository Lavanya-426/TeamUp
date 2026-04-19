const TeamMembership = require("../../models/TeamMembership.js");
const Team = require("../../models/Team.js");

exports.createTeam = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const scope = req.body.scope;

    // Optional pre-check
    const existing = await Team.findOne({ created_by: userId, scope });
    if (existing) {
      return res.status(400).json({
        message: "You already created a team for this scope",
      });
    }

    let team;

    try {
      team = await Team.create({
        ...req.body,
        created_by: userId,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          message: "You already created a team for this scope",
        });
      }
      throw err;
    }
    // Create membership
    try {
      await TeamMembership.create({
        user_id: userId,
        team_id: team._id,
        scope,
        role: "admin",
      });
    } catch (err) {
      await Team.findByIdAndDelete(team._id); // rollback

      if (err.code === 11000) {
        return res.status(400).json({
          message: "User already joined a team in this scope",
        });
      }
      throw err;
    }

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
