const mongoose = require("mongoose");

// ProjectIdentifier holds the context details of what a team is formed for.
// Embedded as a subdocument inside Team — NOT a separate collection.
// Export as a schema (not a model) so Team.js can embed it directly.

const projectIdentifierSchema = new mongoose.Schema(
  {
    projectType: {
      type: String,
      enum: ["COURSE", "ECS", "CAPSTONE"],
      required: true,
    },

    // Only relevant when projectType === "COURSE"
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    teacher: { type: String, default: null },
    slot: { type: String, default: null },
    specialization: { type: String, default: null },
  },
  { _id: false }, // subdocument — no separate _id needed
);

module.exports = projectIdentifierSchema;
