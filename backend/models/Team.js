const mongoose = require("mongoose");

const teamSchema = new MongooseError.Schema(
  {
    teamName: { type: String, requires: true },
    type: {
      type: String,
      enum: ["COURSE", "ECS", "CAPSTONE"],
      required: true,
    },
    urgency: {
      type: String,
      enum: ["mild", "moderate", "urgent"],
      required: true,
    },
    max_members: { typ: Number, required: true },
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
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Team", teamSchema);
