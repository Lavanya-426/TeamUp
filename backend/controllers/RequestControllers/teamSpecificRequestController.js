const TeamMembership = require("../../models/TeamMembership.js");
const TeamJoinRequest = require("../../models/Request.js");

exports.sendRequest = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { teamId } = req.params;

    // already member?
    const isMember = await TeamMembership.findOne({
      student_id: userId,
      team_id: teamId,
    });

    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    // already requested?
    const existing = await TeamJoinRequest.findOne({
      student_id: userId,
      team_id: teamId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = await TeamJoinRequest.create({
      student_id: userId,
      team_id: teamId,
      status: "pending",
    });

    res.status(201).json({ request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.withdrawRequest = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { teamId } = req.params;

    const request = await TeamJoinRequest.findOneAndDelete({
      student_id: userId,
      team_id: teamId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "No pending request found" });
    }

    res.json({ message: "Request withdrawn" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRequestStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { teamId } = req.params;

    const request = await TeamJoinRequest.findOne({
      student_id: userId,
      team_id: teamId,
    });

    if (!request) {
      return res.json({ status: "none" });
    }

    res.json({ status: request.status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { teamId } = req.params;

    // check admin
    const membership = await TeamMembership.findOne({
      student_id: userId,
      team_id: teamId,
    });

    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const requests = await TeamJoinRequest.find({
      team_id: teamId,
      status: "pending",
    });

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
