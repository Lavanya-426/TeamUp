const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["JOIN_REQUEST_RECEIVED", "REQUEST_ACCEPTED", "REQUEST_REJECTED"],
    },

    message: { type: String },

    is_read: { type: Boolean, default: false },

    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    reference_name: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
