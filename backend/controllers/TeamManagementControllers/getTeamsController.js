const TeamMembership = require("../../models/TeamMembership.js");
const Team = require("../../models/Team.js");
const Message = require("../../models/Message");

const buildTeamsResponse = async (memberships) => {
  const teamIds = memberships.map((m) => m.team_id._id);

  const latestMessages = await Message.aggregate([
    {
      $match: {
        teamId: { $in: teamIds },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$teamId",
        latestMessageTime: { $first: "$createdAt" },
      },
    },
  ]);

  const latestMap = {};
  latestMessages.forEach((m) => {
    latestMap[m._id.toString()] = m.latestMessageTime;
  });

  return memberships.map((m) => {
    const team = m.team_id;

    const latestTime = latestMap[team._id.toString()];
    const lastSeen = m.lastSeenAt;

    const hasNewMessages = latestTime && (!lastSeen || latestTime > lastSeen);

    return {
      ...team._doc,
      role: m.role,
      hasNewMessages: !!hasNewMessages,
    };
  });
};

exports.getAdminTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const memberships = await TeamMembership.find({
      user_id: userId,
      role: "admin",
    }).populate("team_id");

    const teams = await buildTeamsResponse(memberships);

    res.json({ teams });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMemberTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const memberships = await TeamMembership.find({
      user_id: userId,
      role: "member",
    }).populate("team_id");

    const teams = await buildTeamsResponse(memberships);

    res.json({ teams });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getAllTeams = async (req, res) => {
//   try {
//     const userId = req.userInfo.id;

//     const memberships = await TeamMembership.find({
//       user_id: userId,
//     }).populate("team_id");

//     const teams = memberships.map((m) => ({
//       ...m.team_id._doc, // actual team fields
//       role: m.role, // attach role here
//     }));

//     console.log("TEAMS:", teams);

//     res.json({ teams });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getAllTeams = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    // get memberships + teams
    const memberships = await TeamMembership.find({
      user_id: userId,
    }).populate("team_id");

    const teamIds = memberships.map((m) => m.team_id._id);

    const latestMessages = await Message.aggregate([
      {
        $match: {
          teamId: { $in: teamIds },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$teamId",
          latestMessageTime: { $first: "$createdAt" },
        },
      },
    ]);

    // convert to map → fast lookup
    const latestMap = {};
    latestMessages.forEach((m) => {
      latestMap[m._id.toString()] = m.latestMessageTime;
    });

    //build final teams
    const teams = memberships.map((m) => {
      const team = m.team_id;

      const latestTime = latestMap[team._id.toString()];
      const lastSeen = m.lastSeenAt;

      const hasNewMessages = latestTime && (!lastSeen || latestTime > lastSeen);

      return {
        ...team._doc,
        role: m.role,
        hasNewMessages: !!hasNewMessages,
      };
    });

    console.log("TEAMS:", teams);
    res.json({ teams });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
