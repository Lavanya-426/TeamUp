const TeamMembership = require("../../models/TeamMembership.js");
const joinRequest = require("../../models/Request.js");
const mongoose = require("mongoose");
exports.viewReceivedRequests = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    console.log("in receiving req");
    // 1. find teams where user is admin
    const adminTeams = await TeamMembership.find({
      user_id: userId,
      role: "admin",
    }).select("team_id");

    const teamIds = adminTeams.map((t) => t.team_id);

    // 2. get all pending requests for those teams
    const requests = await joinRequest
      .find({
        team_id: { $in: teamIds },
        status: "pending",
      })
      .populate("user_id", "name email")
      .populate("team_id", "teamName")
      .sort({ createdAt: -1 }); // newest first;

    console.log(requests);
    return res.json({ requests });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Server error" });
  }
};
exports.viewSentRequests = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userInfo.id);
    console.log("in sending req");

    const requests = await joinRequest.aggregate([
      { $match: { user_id: userId } },

      // JOIN TEAM DATA
      {
        $lookup: {
          from: "teams", // collection name (check exact name!)
          localField: "team_id",
          foreignField: "_id",
          as: "team",
        },
      },

      { $unwind: "$team" }, // convert array → object

      // SORT PRIORITY
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "accepted"] }, then: 2 },
                { case: { $eq: ["$status", "rejected"] }, then: 3 },
                { case: { $eq: ["$status", "withdrawn"] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      },

      { $sort: { statusPriority: 1, requestedAt: -1 } },
    ]);

    return res.json({ requests });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
