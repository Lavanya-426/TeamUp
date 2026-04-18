const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_code: { type: String, required: true, unique: true }, // e.g. "CSE3001"
    course_name: { type: String, required: true }, // e.g. "Software Engineering"
    faculty: { type: String }, // faculty name
    slot: { type: String }, // e.g. "A1+TA1"
    semester: { type: String }, // e.g. "Fall 2024-25"
    degree: { type: String }, // e.g. "B.Tech"
    school: { type: String }, // e.g. "SCOPE"
    branch: { type: String }, // e.g. "CSE"
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
