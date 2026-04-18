const TeamMembership = require("../models/TeamMembership");
const Team = require("../models/Team");
const TeamJoinRequest = require("../models/Request");
const isSameProject = require("../utils/projectIdentifierUtils");

const checkProjectConstraint = (mode = "send") => {
  return async (req, res, next) => {
    try {
      let userId;
      let targetTeam;

      // SEND REQUEST
      if (mode === "send") {
        userId = req.userInfo.id;

        const { teamId } = req.params;

        targetTeam = await Team.findById(teamId);

        if (!targetTeam) {
          return res.status(404).json({ message: "Team not found" });
        }
      }

      // APPROVE REQUEST
      if (mode === "approve") {
        const { requestId } = req.params;

        const request = await TeamJoinRequest.findById(requestId);

        if (!request) {
          return res.status(404).json({ message: "Request not found" });
        }

        userId = request.id;

        targetTeam = await Team.findById(request.team_id);

        req.requestDoc = request; // reuse later
      }

      // check memberships
      const memberships = await TeamMembership.find({
        user_id: userId,
      }).populate("team_id");

      for (let m of memberships) {
        if (isSameProject(m.team_id, targetTeam)) {
          return res.status(400).json({
            message: "Already part of a team for this project",
          });
        }
      }

      req.targetTeam = targetTeam; // reuse in controller
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = checkProjectConstraint;
