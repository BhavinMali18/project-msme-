const mongoose = require("mongoose");

const mentorAssignmentSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "completed", "unassigned"],
      default: "active"
    },
    feedbackLog: [{
      date: { type: Date, default: Date.now },
      note: String,
      attachments: [String]
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorAssignment", mentorAssignmentSchema);
