const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");

// SEND REQUEST

exports.sendRequest = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { teamId } = req.params;
    const targetTeam = req.targetTeam;

    const scope = targetTeam.scope; // use stored scope

    // already a member of THIS team?
    const isMember = await TeamMembership.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    // already in another team in SAME scope?
    const existingMembership = await TeamMembership.findOne({
      user_id: userId,
      scope,
    });

    if (existingMembership) {
      return res.status(400).json({
        message: "Already in a team for this project",
      });
    }

    // team full check
    if (targetTeam.current_members >= targetTeam.max_members) {
      return res.status(400).json({ message: "Team is full" });
    }

    // existing request for SAME team
    const existingRequest = await TeamJoinRequest.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // create new request
    const request = await TeamJoinRequest.create({
      user_id: userId,
      team_id: teamId,
      scope,
    });

    res.status(201).json({ request });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate request",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// WITHDRAW REQUEST
exports.withdrawRequest = async (req, res) => {
  try {
    const userId = req.userInfo.user_id;
    const { teamId } = req.params;

    const request = await TeamJoinRequest.findOne({
      user_id: userId,
      team_id: teamId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "No pending request found" });
    }

    // update status
    request.status = "withdrawn";
    request.respondedAt = new Date();
    await request.save();

    res.json({ message: "Request withdrawn" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
};

// GET REQUEST STATUS
exports.getRequestStatus = async (req, res) => {
  try {
    const userId = req.userInfo.user_id;
    const { teamId } = req.params;

    const request = await TeamJoinRequest.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (!request) {
      return res.json({ status: "none" });
    }

    res.json({ status: request.status });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL REQUESTS (ADMIN ONLY → handled by middleware)
exports.getAllRequests = async (req, res) => {
  try {
    const { teamId } = req.params;

    const requests = await TeamJoinRequest.find({
      team_id: teamId,
      status: "pending",
    })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
