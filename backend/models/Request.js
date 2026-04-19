const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
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

    scope: {
      type: String,
      required: true,
      index: true, // for updateMany
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },

    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "requestedAt", updatedAt: "updatedAt" },
  },
);

// Prevent a user from having more than one request document per team
requestSchema.index({ user_id: 1, team_id: 1 }, { unique: true });
// For efficient lookup of pending requests by user and scope
requestSchema.index({ user_id: 1, scope: 1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);
