const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");

exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await TeamJoinRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const teamId = request.team_id;

    // check admin
    const admin = await TeamMembership.findOne({
      student_id: req.user.user_id,
      team_id: teamId,
    });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    // prevent duplicate membership
    const exists = await TeamMembership.findOne({
      student_id: request.student_id,
      team_id: teamId,
    });

    if (!exists) {
      await TeamMembership.create({
        student_id: request.student_id,
        team_id: teamId,
        role: "member",
      });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await TeamJoinRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const teamId = request.team_id;

    // check admin
    const admin = await TeamMembership.findOne({
      student_id: req.user.user_id,
      team_id: teamId,
    });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
