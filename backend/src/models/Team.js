const mongoose = require("mongoose");

// Generate a random 8-char uppercase invite code
function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    logoUrl: String,
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    inviteCode: {
      type: String,
      unique: true,
      default: generateInviteCode,
    },
    maxMembers: { type: Number, default: 4 },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
