const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    logoUrl: String,
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    memberIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
