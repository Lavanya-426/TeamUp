const Team = require("../../models/Team");
const TeamMembership = require("../../models/TeamMembership");
const isSameProject = require("../../utils/projectIdentifier");

exports.discoverTeams = async (req, res) => {
  try {
    const user = req.user;
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    // Step 1: get user memberships
    const memberships = await TeamMembership.find({
      user_id: user.user_id,
    }).populate("team_id");

    // Step 2: check restriction (already in same project)
    for (let m of memberships) {
      const team = m.team_id;

      if (!team) continue;

      // COURSE
      if (
        type === "COURSE" &&
        team.type === "COURSE" &&
        team.course_id?.toString() === user.course_id &&
        team.slot === user.slot &&
        team.teacher === user.teacher
      ) {
        return res.status(400).json({
          message: "Already in this course project",
        });
      }

      // CAPSTONE
      if (
        type === "CAPSTONE" &&
        team.type === "CAPSTONE" &&
        team.specialization === user.specialization
      ) {
        return res.status(400).json({
          message: "Already in this capstone",
        });
      }

      // ECS
      if (type === "ECS" && team.type === "ECS") {
        return res.status(400).json({
          message: "Already in an ECS team",
        });
      }
    }

    // Step 3: build query based on type
    let query = {
      type,
      status: "OPEN",
    };

    if (type === "COURSE") {
      query.course_id = user.course_id;
      query.slot = user.slot;
      query.teacher = user.teacher;
    }

    if (type === "CAPSTONE") {
      query.specialization = user.specialization;
    }

    // ECS → no extra filters

    // Step 4: exclude joined teams
    const joinedIds = memberships.map((m) => m.team_id?._id);

    query._id = { $nin: joinedIds };

    // Step 5: fetch teams
    const teams = await Team.find(query)
      .populate("created_by", "name email")
      .sort({ createdAt: -1 });

    res.json({ teams });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
