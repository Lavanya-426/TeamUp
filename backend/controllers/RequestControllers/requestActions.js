const mongoose = require("mongoose");
const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");
const Team = require("../../models/Team");

exports.approveRequest = async (req, res) => {
  try {
    const { teamId } = req.params;

    const request = await TeamJoinRequest.findById(req.requestDoc._id);

    if (!request) {
      return res.status(400).json({ message: "Invalid action" });
    }

    if (request.team_id.toString() !== teamId) {
      return res.status(400).json({ message: "Team mismatch" });
    }

    if (request.status === "accepted") {
      return res.json({ message: "Already approved" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Invalid action" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const scope = team.scope;

    // 1. Reserve slot (atomic)
    const updated = await Team.updateOne(
      {
        _id: teamId,
        current_members: { $lt: team.max_members },
      },
      { $inc: { current_members: 1 } },
    );

    if (updated.modifiedCount === 0) {
      return res.status(400).json({ message: "Team is full" });
    }

    // 2. Create membership
    try {
      await TeamMembership.create({
        user_id: request.user_id,
        team_id: teamId,
        scope,
        role: "member",
      });
    } catch (err) {
      // rollback slot manually
      await Team.updateOne({ _id: teamId }, { $inc: { current_members: -1 } });

      if (err.code === 11000) {
        return res.status(400).json({
          message: "User already joined a team in this class",
        });
      }

      throw err;
    }

    // 3. Mark accepted
    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    // 4. Reject same-scope requests
    await TeamJoinRequest.updateMany(
      {
        user_id: request.user_id,
        scope,
        status: "pending",
        _id: { $ne: request._id },
      },
      {
        status: "rejected",
        respondedAt: new Date(),
      },
    );

    // 5. If team becomes full
    const updatedTeam = await Team.findById(teamId);

    if (updatedTeam.current_members >= updatedTeam.max_members) {
      await Team.updateOne({ _id: teamId }, { status: "FULL" });

      await TeamJoinRequest.updateMany(
        {
          team_id: teamId,
          status: "pending",
          _id: { $ne: request._id },
        },
        {
          status: "rejected",
          respondedAt: new Date(),
        },
      );
    }

    res.json({ message: "Approved" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message || "Server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId, teamId } = req.params;

    const request = await TeamJoinRequest.findById(requestId);

    if (!request) {
      return res.status(400).json({ message: "Invalid action" });
    }

    if (request.team_id.toString() !== teamId) {
      return res.status(400).json({ message: "Team mismatch" });
    }

    // Idempotent behavior
    if (request.status === "rejected") {
      return res.json({ message: "Already rejected" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Invalid action" });
    }

    request.status = "rejected";
    request.respondedAt = new Date();
    await request.save();

    res.json({ message: "Rejected" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
