const TeamMembership = require("../models/TeamMembership");

const requireAdmin = (teamIdParam = "teamId") => {
  return async (req, res, next) => {
    try {
      const userId = req.userInfo.id;
      const teamId = req.params[teamIdParam];

      const membership = await TeamMembership.findOne({
        student_id: userId,
        team_id: teamId,
      });

      if (!membership || membership.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = requireAdmin;
