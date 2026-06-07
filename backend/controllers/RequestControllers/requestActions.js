const mongoose = require("mongoose");
const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");
const Team = require("../../models/Team");

exports.approveRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { teamId } = req.params;
    let resultPayload = null;
    console.log("Approving request", req.requestDoc._id, "for team", teamId);
    await session.withTransaction(async () => {
      console.log("transaction started");
      const request = await TeamJoinRequest.findById(
        req.requestDoc._id,
      ).session(session);
      if (!request) throw new Error("Invalid action");
      if (request.team_id.toString() !== teamId)
        throw new Error("Team mismatch");
      if (request.status === "accepted") {
        resultPayload = { message: "Already approved" };
        return;
      }
      if (request.status !== "pending") throw new Error("Invalid action");

      const reserveRes = await Team.updateOne(
        { _id: teamId, $expr: { $lt: ["$current_members", "$max_members"] } },
        { $inc: { current_members: 1 } },
        { session },
      );
      console.log("Reserve result:", reserveRes);
      if (reserveRes.modifiedCount === 0) throw new Error("Team is full");

      const team = await Team.findById(teamId).session(session);
      const scope = team.scope;

      await TeamMembership.create(
        [{ user_id: request.user_id, team_id: teamId, scope, role: "member" }],
        { session },
      );
      console.log("Membership created");
      request.status = "accepted";
      request.respondedAt = new Date();
      await request.save({ session });

      await TeamJoinRequest.updateMany(
        {
          user_id: request.user_id,
          scope,
          status: "pending",
          _id: { $ne: request._id },
        },
        { status: "rejected", respondedAt: new Date() },
        { session },
      );
      console.log("Other pending requests rejected");
      const latestTeam = await Team.findById(teamId).session(session);
      if (latestTeam.current_members >= latestTeam.max_members) {
        await Team.updateOne({ _id: teamId }, { status: "FULL" }, { session });
        await TeamJoinRequest.updateMany(
          { team_id: teamId, status: "pending", _id: { $ne: request._id } },
          { status: "rejected", respondedAt: new Date() },
          { session },
        );
      }
      console.log("Finalized request approval");
      resultPayload = { message: "Approved" };
    });

    return res.json(resultPayload || { message: "Approved" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  } finally {
    await session.endSession();
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
