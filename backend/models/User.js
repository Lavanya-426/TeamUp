const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    mobile: { type: String },

    password: { type: String, required: true },

    degree: { type: String },

    school: { type: String },

    branch: { type: String },

    specialization: { type: String },

    year: { type: Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
