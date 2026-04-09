const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    passworrd: { type: String, required: true },
    degree: { type: String },
    school: { type: String },
    branch: { type: String },
    specialisation: { type: String },
    year: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
