const mongoose = require("mongoose");

const teamRequirementSchema = new mongoose.Schema({
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  requirement_type: {
    type: String,
    enum: [
      "branch",
      "specialization",
      "course",
      "teacher",
      "slot",
      "school",
      "degree",
      "skill",
    ],
    required: true,
  },

  requirement_value: {
    type: String,
    required: true,
  },

  min_count: Number,
  max_count: Number,
});

module.exports = mongoose.model("TeamRequirement", teamRequirementSchema);
