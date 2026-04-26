const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
  console.log("MongoDB connected");
};
