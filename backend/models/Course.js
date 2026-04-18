const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_code: { type: String, required: true, unique: true }, // e.g. "CSE3001"
    course_name: { type: String, required: true }, // e.g. "Software Engineering"
    faculty: { type: String }, // faculty name
    slot: { type: String }, // e.g. "A1+TA1"
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
