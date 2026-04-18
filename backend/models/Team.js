const mongoose = require("mongoose");
const projectIdentifierSchema = require("./projectIdentifier"); // plain schema, not a model

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },

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

    max_members: { type: Number, required: true },

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
    deadline: {
      type: Date,
      required: true,
    },
    project_identifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project identifer",
      required: true,
    },
    // Embedded subdocument — holds course/ECS/capstone context
    // course_id lives inside project_identifier, not duplicated here
    project_identifier: {
      type: projectIdentifierSchema,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Team", teamSchema);
