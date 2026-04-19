const mongoose = require("mongoose");
const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");
const Team = require("../../models/Team");

exports.approveRequest = async (req, res) => {
  let session;
  try {
    const { teamId } = req.params;

    // 1. Fetch request FIRST (no transaction yet)
    const request = await TeamJoinRequest.findById(req.requestDoc._id);

    if (!request) {
      return res.status(400).json({ message: "Invalid action" });
    }

    if (request.team_id.toString() !== teamId) {
      return res.status(400).json({ message: "Team mismatch" });
    }

    // Idempotency: already accepted
    if (request.status === "accepted") {
      return res.json({ message: "Already approved" });
    }

    // Reject / withdrawn → not allowed
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Invalid action" });
    }

    // 2. Start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Re-fetch inside transaction
    const txRequest = await TeamJoinRequest.findById(request._id).session(
      session,
    );
    const team = await Team.findById(teamId).session(session);

    if (!team) throw new Error("Team not found");

    const scope = team.scope;

    // 3. Reserve slot (atomic)
    const updated = await Team.updateOne(
      {
        _id: teamId,
        current_members: { $lt: team.max_members },
      },
      { $inc: { current_members: 1 } },
      { session },
    );

    if (updated.modifiedCount === 0) {
      throw new Error("Team is full");
    }

    // 4. Create membership (with rollback safety)
    try {
      await TeamMembership.create(
        [
          {
            user_id: txRequest.user_id,
            team_id: teamId,
            scope,
            role: "member",
          },
        ],
        { session },
      );
    } catch (err) {
      if (err.code === 11000) {
        // rollback slot
        await Team.updateOne(
          { _id: teamId },
          { $inc: { current_members: -1 } },
          { session },
        );
      }
      throw err;
    }

    //  5. Mark accepted
    txRequest.status = "accepted";
    txRequest.respondedAt = new Date();
    await txRequest.save({ session });

    // 6. Reject same-scope requests
    await TeamJoinRequest.updateMany(
      {
        user_id: txRequest.user_id,
        scope,
        status: "pending",
        _id: { $ne: txRequest._id },
      },
      {
        status: "rejected",
        respondedAt: new Date(),
      },
      { session },
    );

    // 7. If team becomes full → mark + cleanup team
    const newCount = team.current_members + 1;

    if (newCount >= team.max_members) {
      await Team.updateOne({ _id: teamId }, { status: "FULL" }, { session });

      await TeamJoinRequest.updateMany(
        {
          team_id: teamId,
          status: "pending",
          _id: { $ne: txRequest._id },
        },
        {
          status: "rejected",
          respondedAt: new Date(),
        },
        { session },
      );
    }

    await session.commitTransaction();
    res.json({ message: "Approved" });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
    }

    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "User already joined a team in this class",
      });
    }

    res.status(400).json({ message: err.message || "Server error" });
  } finally {
    if (session) session.endSession();
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
