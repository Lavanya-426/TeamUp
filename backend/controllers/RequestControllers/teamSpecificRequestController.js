const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");

exports.sendRequest = async (req, res) => {
  try {
    console.log("in send request controller");

    const userId = req.userInfo.id;
    const { teamId } = req.params;
    const targetTeam = req.targetTeam;

    const scope = targetTeam.scope;

    //  Run independent queries in parallel
    const [membership, pendingReq, existingRequest] = await Promise.all([
      // membership check (same team OR same scope)
      TeamMembership.findOne({
        user_id: userId,
        $or: [{ team_id: teamId }, { scope }],
      }).lean(),

      // pending request check
      TeamJoinRequest.findOne({
        user_id: userId,
        team_id: teamId,
        status: "pending",
      }).lean(),

      // any existing request (for reuse)
      TeamJoinRequest.findOne({
        user_id: userId,
        team_id: teamId,
      }),
    ]);

    // Already a member
    if (membership) {
      if (String(membership.team_id) === String(teamId)) {
        return res
          .status(400)
          .json({ message: "Already a member of this team" });
      }

      return res
        .status(400)
        .json({ message: "Already in a team for this project" });
    }

    //  Team full
    if (targetTeam.current_members >= targetTeam.max_members) {
      return res.status(400).json({ message: "Team is full" });
    }

    //  Already pending
    if (pendingReq) {
      return res.status(400).json({ message: "Request already sent" });
    }

    //  Reuse existing request (withdrawn/rejected)
    if (existingRequest) {
      existingRequest.status = "pending";
      existingRequest.respondedAt = null;
      await existingRequest.save();

      return res.status(200).json({
        message: "Request sent again",
        request: existingRequest,
      });
    }

    //  Create new request
    const request = await TeamJoinRequest.create({
      user_id: userId,
      team_id: teamId,
      scope,
    });

    return res.status(201).json({
      message: "Request sent",
      request,
    });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate request",
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};
// WITHDRAW REQUEST
exports.withdrawRequest = async (req, res) => {
  try {
    const userId = req.userInfo.id;
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
