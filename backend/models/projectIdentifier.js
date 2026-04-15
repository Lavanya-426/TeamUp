const mongoose = require("mongoose");

const projectIdentifierSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["COURSE", "ECS", "CAPSTONE"],
    required: true,
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  teacher: String,

  slot: String,
  specialization: String,
});

module.exports = mongoose.model("projectIdentifier", projectIdentifierSchema);
