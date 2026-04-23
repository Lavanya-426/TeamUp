const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },

    type: {
      type: String,
      enum: ["COURSE", "ECS1", "ECS2", "CAPSTONE", "SDP"],
      required: true,
    },

    scope: {
      type: String,
      required: true,
      index: true, // for discovery
    },

    urgency: {
      type: String,
      enum: ["mild", "moderate", "urgent"],
      required: true,
    },

    max_members: { type: Number, required: true, min: 1 },

    description: { type: String },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    current_members: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ["OPEN", "FULL"],
      default: "OPEN",
    },

    deadline: {
      type: Date,
      required: true,
    },

    course: {
      course_code: String,
      teacher: String,
      slot: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Team", teamSchema);
