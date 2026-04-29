const TeamMembership = require("../models/TeamMembership.js");
const TeamJoinRequest = require("../models/Request.js");

// GET REQUEST STATUS
async function getRequestStatus(teamId, userId) {
  try {
    const request = await TeamJoinRequest.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (!request) {
      return "none";
    }

    return request.status;
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
}

module.exports = getRequestStatus;
