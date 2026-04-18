const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joined_at: {
    type: Date,
    default: Date.now,
  },
});

// Ensures a user can only appear once per team
teamMemberSchema.index({ user_id: 1, team_id: 1 }, { unique: true });

module.exports = mongoose.model("TeamMember", teamMemberSchema);
