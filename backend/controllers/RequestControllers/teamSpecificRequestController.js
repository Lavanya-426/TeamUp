const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");

// SEND REQUEST

exports.sendRequest = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { teamId } = req.params;
    const targetTeam = req.targetTeam;

    // already member?
    const isMember = await TeamMembership.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    // team full check
    if (targetTeam.current_members >= targetTeam.max_members) {
      return res.status(400).json({ message: "Team is full" });
    }

    // existing request
    const existingRequest = await TeamJoinRequest.findOne({
      user_id: userId,
      team_id: teamId,
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "Request already sent" });
      }

      existingRequest.status = "pending";
      existingRequest.respondedAt = null;
      await existingRequest.save();

      return res.status(200).json({ request: existingRequest });
    }

    const request = await TeamJoinRequest.create({
      user_id: userId,
      team_id: teamId,
    });

    res.status(201).json({ request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// WITHDRAW REQUEST
exports.withdrawRequest = async (req, res) => {
  try {
    const userId = req.user.user_id;
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
    await request.save();

    res.json({ message: "Request withdrawn" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET REQUEST STATUS
exports.getRequestStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { teamId } = req.params;

    const request = await TeamJoinRequest.findOne({
      user_id: userId,
      team_id: teamId,
    }).sort({ createdAt: -1 });

    if (!request) {
      return res.json({ status: "none" });
    }

    res.json({ status: request.status });
  } catch (err) {
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
    res.status(500).json({ message: "Server error" });
  }
};
