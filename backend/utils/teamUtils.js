const Team = require("../models/Team");
const TeamMembership = require("../models/TeamMembership");

const updateTeamStats = async (teamId) => {
  const memberCount = await TeamMembership.countDocuments({
    team_id: teamId,
  });

  const team = await Team.findById(teamId);

  if (!team) return;

  team.current_members = memberCount;

  if (memberCount >= team.max_members) {
    team.status = "FULL";
  } else {
    team.status = "OPEN";
  }

  await team.save();
};

module.exports = updateTeamStats;
